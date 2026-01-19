"use client";

export default function SpotifyPlayer() {
  return (
    
      <iframe
        src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcxvFzl58uP7"
        style={{
          
          width: "100%",
          height: "100%",
        }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    
  );
}
