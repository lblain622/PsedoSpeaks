import AudioRecorder from "@/components/AudioRecorder";

export const runtime = 'edge';
export default function Home() {
  return (
    <div>
      <div style={{ position: "fixed", top: "10px", right: "10px", zIndex: 1000 }}>
        <ToggleInvertColors />
      </div>
      <div className="content">
        <AudioRecorder />
      </div>
    </div>
  );
}
