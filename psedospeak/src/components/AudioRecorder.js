'use client';

import React, { useState, useRef } from 'react';
import { uploadAndProcessAudio } from '../utils/geminiClient';

import { Textarea } from "@heroui/input";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState(null); // Store the API response
  const [isButtonClicked, setIsButtonClicked] = useState(false); // Track button click
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

        // Convert the Blob into a File
        const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

        try {
          const geminiResponse = await uploadAndProcessAudio(file);
          setResponse(geminiResponse); // Store the API response
        } catch (error) {
          console.error('❌ Error processing audio:', error);
          setResponse({
            input: "Error",
            output: "An error occurred while processing the audio.",
            variables: [],
            feedback: "Please try again.",
          });
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4" style={{ color: 'red' }}>
      {/* Start/Stop Recording Button */}
      <button
        onClick={() => {
          toggleRecord();
          setIsButtonClicked(true); // Show the Textarea after clicking
        }}
        className={"bg-amber-500 px-4 py-2 rounded"}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {/* Conditional Rendering */}
      {!isButtonClicked ? (
        <p>No response yet.</p> // Initial state
      ) : response ? (
        <Card className="w-full max-w-4xl mt-8">
          <CardHeader>
            <h1 className="text-2xl font-bold">App Functionality</h1>
          </CardHeader>

          <CardBody className="space-y-4">
            {/* Input Section */}
            <p className="text-lg font-semibold">
              📥 Input: {response.input || "N/A"}
            </p>

            <Textarea
              className="w-full bg-yellow-200 rounded-lg border border-black p-4 leading-normal"
              description=""
              label=""
              placeholder="Start writing your pseudo code here!"
              variant="faded"
              size="lg"
              value={
                response
                  ? `📤 Output:\n${(response.output || "").split('\n').join('\n')}`
                  : ""
              }
              onChange={(e) => setResponse(e.target.value)} // Optional: Allow editing
            />

            <div className="space-y-2">
              <p>
                🔍 Variables: {(response.variables || []).join(', ') || "N/A"}
              </p>
              <p>
                💬 Feedback: {response.feedback || "N/A"}
              </p>
            </div>
          </CardBody>

          <CardFooter>
            {/* Optional Footer Content */}
          </CardFooter>
        </Card>
      ) : (
        <p>Processing audio...</p> // Loading state
      )}
    </div>
  );
}