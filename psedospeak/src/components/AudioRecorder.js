'use client';

import { useState, useRef, useEffect } from 'react';
import { uploadAndProcessAudio, getLatestGeminiResponse } from '../utils/geminiClient';

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  useEffect(() => {
    // Cargar la última respuesta guardada al iniciar
    fetchLatestResponse();
  }, []);

  const fetchLatestResponse = async () => {
    try {
      const latestResponse = await getLatestGeminiResponse();
      setResponse(latestResponse);
    } catch (error) {
      console.error('Error fetching latest response:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

        try {
          await uploadAndProcessAudio(file);
          await fetchLatestResponse(); // Cargar la respuesta actualizada después del procesamiento
        } catch (error) {
          console.error('Error processing audio:', error);
        }

        audioChunksRef.current = [];
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div>
      <h2>🎙 Record Audio</h2>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? '🛑 Stop Recording' : '🎤 Start Recording'}
      </button>
      <div>
        <h3>🧠 Gemini's Response:</h3>
        {response ? (
          <div>
            <p><strong>📥 Input:</strong> {response.input}</p>
            <p><strong>📤 Output:</strong></p>
            <ul>
              {response.output.split('\n').map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
            <p><strong>🔍 Variables:</strong> {response.variables.join(', ')}</p>
            <p><strong>💬 Feedback:</strong> {response.feedback}</p>
          </div>
        ) : (
          <p>No response yet.</p>
        )}
      </div>
    </div>
  );
}
