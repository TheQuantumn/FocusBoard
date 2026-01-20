"use client";

import { useEffect, useState } from "react";

const RADIUS = 88;
const STROKE = 12;
const SIZE = 220;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Pomodoro() {
  const [studyMinutes, setStudyMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  const [mode, setMode] = useState<"FOCUS" | "BREAK">("FOCUS");
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(studyMinutes * 60);

  const [showSettings, setShowSettings] = useState(false);
  const [tempStudy, setTempStudy] = useState(studyMinutes);
  const [tempBreak, setTempBreak] = useState(breakMinutes);

  const totalSeconds =
    mode === "FOCUS" ? studyMinutes * 60 : breakMinutes * 60;

  /* ================= TIMER LOGIC ================= */

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (mode === "FOCUS") {
            setMode("BREAK");
            return breakMinutes * 60;
          } else {
            setMode("FOCUS");
            return studyMinutes * 60;
          }
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running, mode, studyMinutes, breakMinutes]);

  const progress = 1 - secondsLeft / totalSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const accent =
    mode === "FOCUS"
      ? "var(--accent-purple)"
      : "var(--accent-green)";

  /* ================= UI ================= */

  return (
    <>
      {/* ================= CARD ================= */}
      <div
        className="card"
        style={{
          width: "320px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="section-label">Pomodoro</div>

          <button
            onClick={() => setShowSettings(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ⚙
          </button>
        </div>

        {/* Timer Dial */}
        <div
          style={{
            width: SIZE,
            height: SIZE,
            margin: "0 auto",
            position: "relative",
          }}
        >
          <svg width={SIZE} height={SIZE}>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={STROKE}
              fill="none"
            />

            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              stroke={accent}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
            />
          </svg>

          {/* Center Content */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <div
              className="numeric"
              style={{
                fontSize: "32px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {minutes}:{seconds.toString().padStart(2, "0")}
            </div>

            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                color: accent,
              }}
            >
              {mode === "FOCUS" ? "FOCUS NOW" : "BREAK"}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{ flex: 1 }} onClick={() => setRunning(true)}>
            Start
          </button>

          <button
            style={{ flex: 1 }}
            onClick={() => {
              setRunning(false);
              setMode("FOCUS");
              setSecondsLeft(studyMinutes * 60);
            }}
          >
            Reset
          </button>

          {mode === "BREAK" && (
            <button
              style={{ flex: 1 }}
              onClick={() => {
                setMode("FOCUS");
                setSecondsLeft(studyMinutes * 60);
              }}
            >
              Skip
            </button>
          )}
        </div>
      </div>

      {/* ================= SETTINGS MODAL (VIEWPORT) ================= */}
      {showSettings && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "24px",
          }}
        >
          <div
            style={{
              width: "420px",
              maxWidth: "100%",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: 600 }}>
                Pomodoro Settings
              </div>

              <button
                onClick={() => setShowSettings(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Study duration (minutes)
                </label>
                <input
                  type="number"
                  value={tempStudy}
                  onChange={(e) => setTempStudy(+e.target.value)}
                  style={{
                    height: "40px",
                    padding: "0 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-main)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Break duration (minutes)
                </label>
                <input
                  type="number"
                  value={tempBreak}
                  onChange={(e) => setTempBreak(+e.target.value)}
                  style={{
                    height: "40px",
                    padding: "0 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-main)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setStudyMinutes(tempStudy);
                  setBreakMinutes(tempBreak);
                  setMode("FOCUS");
                  setRunning(false);
                  setSecondsLeft(tempStudy * 60);
                  setShowSettings(false);
                }}
                style={{
                  background: "var(--accent-purple)",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
