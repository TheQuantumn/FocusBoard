"use client";

import { useRouter } from "next/navigation";
import Pomodoro from "./Pomodoro";
import BoardClient from "./BoardClient";
import DarkVeil from "../components/DarkVeil";

export default function BoardPage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    router.push("/login");
  }

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "var(--bg-main)",
        isolation: "isolate",
      }}
    >
      {/* ===== BACKGROUND ===== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none", // 🔑 background never blocks UI
        }}
      >
        <DarkVeil speed={0.18} warpAmount={0.08} noiseIntensity={0.015} />
      </div>

      {/* ===== CONTENT ===== */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* ===== TOP BAR ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Log out
          </button>
        </div>

        {/* ===== TOP ROW: Pomodoro + Spotify ===== */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            width: "100%",
            alignItems: "stretch",
          }}
        >
          {/* Pomodoro – fixed size */}
          <div
            style={{
              flex: "0 0 40%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pomodoro />
          </div>

          {/* Spotify – fills remaining space */}
          <div
            style={{
              flex: "0 0 60%",
              minHeight: "360px",
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

        {/* ===== KANBAN BOARD ===== */}
        <BoardClient />
      </div>
    </main>
  );
}
