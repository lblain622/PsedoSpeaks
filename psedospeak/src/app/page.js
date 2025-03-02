import Image from "next/image";
import ToggleInvertColors from './theme';

import dynamic from 'next/dynamic';
import AudioRecorder from "@/components/AudioRecorder";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4" 
        style={{ color: 'purple' }}>
            <h1 className="text-2xl font-bold mb-4">🗣 Talk to Gemini</h1>
            <ToggleInvertColors/>
            <AudioRecorder />

        </div>
    );
}
