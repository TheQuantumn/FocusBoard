"use client";

export default function SpotifyPlayer() {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
      }}
    >
      <h3>Music</h3>

      <iframe
        src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcxvFzl58uP7"
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ borderRadius: "8px" }}
      ></iframe>

      <p style={{ fontSize: "12px", marginTop: "8px", opacity: 0.7 }}>
        Lo-fi / focus playlist
      </p>
    </div>
  );
}
