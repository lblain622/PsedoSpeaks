import AudioRecorder from "@/components/AudioRecorder";
import ToggleInvertColors from "@/components/theme";

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