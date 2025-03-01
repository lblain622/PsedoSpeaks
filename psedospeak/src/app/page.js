import dynamic from 'next/dynamic';
import AudioRecorder from "@/components/AudioRecorder";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">🗣 Talk to Gemini</h1>
            <AudioRecorder />
        </div>
    );
}
