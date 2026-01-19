import BoardClient from "./BoardClient";
import Pomodoro from "./Pomodoro";
import SpotifyPlayer from "./SpotifyPlayer";

export default function BoardPage() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        gap: "24px",
      }}
    >
      {/* Left: Kanban */}
      <BoardClient />

      {/* Right: Utilities */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Pomodoro />
        <SpotifyPlayer />
      </div>
    </div>
  );
}
