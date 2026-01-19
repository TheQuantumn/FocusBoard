import Pomodoro from "./Pomodoro";
import SpotifyPlayer from "./SpotifyPlayer";
import BoardClient from "./BoardClient";

export default function BoardPage() {
  return (
    <div
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* TOP ROW: Pomodoro + Spotify */}
      <div
  style={{
    display: "flex",
    gap: "20px",
    width: "100%",
    alignItems: "stretch",
  }}
>
  {/* Pomodoro – 40% */}
  <div
    style={{
      flex: "0 0 40%",
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Pomodoro />
  </div>

  {/* Spotify – 60% */}
  <div
  style={{
    flex: "0 0 60%",
    minHeight: "360px",           // 👈 THIS IS THE KEY
    background: "var(--bg-card)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "12px",
    overflow: "hidden",
    display: "flex",
  }}
>
  <iframe
    src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcxvFzl58uP7"
    style={{
      width: "100%",
      height: "100%",
      border: "none",
    }}
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
  />
</div>

</div>


      {/* BOTTOM: Kanban Board */}
      <BoardClient />
    </div>
  );
}
