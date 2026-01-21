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
          pointerEvents: "none",
        }}
      >
        <DarkVeil speed={0.18} warpAmount={0.08} noiseIntensity={0.015} />
      </div>

      {/* ===== CONTENT ===== */}
      <div className="board-root">
        {/* ===== TOP BAR ===== */}
        <div className="top-bar">
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>

        {/* ===== TOP ROW ===== */}
        <div className="top-row">
          <div className="pomodoro-wrap">
            <Pomodoro />
          </div>

          <div className="spotify-wrap">
            <iframe
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcxvFzl58uP7"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>

        {/* ===== KANBAN ===== */}
        <BoardClient />
      </div>

      {/* ===== RESPONSIVE STYLES ===== */}
      <style jsx>{`
        .board-root {
          position: relative;
          z-index: 1;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .top-bar {
          display: flex;
          justify-content: flex-end;
        }

        .logout-btn {
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .top-row {
          display: flex;
          gap: 20px;
          width: 100%;
          align-items: stretch;
        }

        .pomodoro-wrap {
          flex: 0 0 40%;
          display: flex;
          justify-content: center;
        }

        .spotify-wrap {
          flex: 0 0 60%;
          min-height: 360px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          overflow: hidden;
        }

        .spotify-wrap iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        /* ===== MOBILE ===== */
        @media (max-width: 768px) {
          .board-root {
            padding: 16px;
            gap: 20px;
          }

          .top-row {
            flex-direction: column;
          }

          .pomodoro-wrap {
            flex: none;
          }

          .spotify-wrap {
            flex: none;
            height: 260px;
          }
        }

        /* ===== SMALL PHONES ===== */
        @media (max-width: 480px) {
          .spotify-wrap {
            height: 220px;
          }
        }
      `}</style>
    </main>
  );
}
