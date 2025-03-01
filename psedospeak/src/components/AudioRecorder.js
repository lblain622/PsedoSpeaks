'use client';

import { useState, useRef } from 'react';
import { uploadAndProcessAudio } from '../utils/geminiClient';

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

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

        // Convertimos el Blob en un File
        const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

        try {
          const geminiResponse = await uploadAndProcessAudio(file);
          setResponse(geminiResponse);
        } catch (error) {
          console.error('❌ Error processing audio:', error);
          setResponse('An error occurred while processing the audio.');
        }

        audioChunksRef.current = []; // Limpiar la memoria
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('❌ Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop()); // Detener el micrófono
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
          <ul>
            {response.split('\n').map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        ) : (
          <p>No response yet.</p>
        )}
      </div>
    </div>
  );
}
