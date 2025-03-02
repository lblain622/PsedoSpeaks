'use client';

import React, { useState, useRef } from 'react';
import { uploadAndProcessAudio } from '../utils/geminiClient';

import { Textarea } from "@heroui/input";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const [value, setValue] = useState(''); // for TextArea response

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

        // Convert the Blob into a File
        const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

        try {
          const geminiResponse = await uploadAndProcessAudio(file);
          setResponse(geminiResponse);
        } catch (error) {
          console.error('❌ Error processing audio:', error);
          setResponse('An error occurred while processing the audio.');
        }

        audioChunksRef.current = []; // Clear memory
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
      streamRef.current.getTracks().forEach(track => track.stop()); // Stop the microphone
    }
  };

  const toggleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div>
      <button onClick={toggleRecord} className={"bg-amber-500"}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div>
        <h3>🧠 Gemini's Response:</h3>
        {response ? (
          <>
            <h1 className="text-2xl font-bold mb-4">App Functionality</h1>
            <h2 className="text-lg font-semibold">Pseudo Code Editor</h2>
          <div className="flex justify-center items-center h-screen" style={{color:'red'}}> 
                <Textarea
                  className="w-full sm:w-96 md:w-[800px] lg:max-w-4xl h-96"
                  description=""
                  label=""
                  placeholder="Start writing your pseudo code here!"
                  variant="faded"
                  size="lg"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                />
              </div>
          </>
        ) : (
          <p>No response yet.</p>
        )}
      </div>
    </div>
  );
}