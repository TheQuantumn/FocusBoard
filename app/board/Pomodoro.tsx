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
    <div
      className="card"
      style={{
        width: "320px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        position: "relative",
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

      {/* ================= SETTINGS MODAL ================= */}

      {showSettings && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: "280px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: 600 }}>Settings</div>

              <button
                onClick={() => setShowSettings(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Study (minutes)
              </label>
              <input
                type="number"
                value={tempStudy}
                onChange={(e) => setTempStudy(+e.target.value)}
                style={{ width: "100%", marginTop: "4px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Break (minutes)
              </label>
              <input
                type="number"
                value={tempBreak}
                onChange={(e) => setTempBreak(+e.target.value)}
                style={{ width: "100%", marginTop: "4px" }}
              />
            </div>

            <button
              onClick={() => {
                setStudyMinutes(tempStudy);
                setBreakMinutes(tempBreak);
                setMode("FOCUS");
                setRunning(false);
                setSecondsLeft(tempStudy * 60);
                setShowSettings(false);
              }}
              style={{ marginTop: "6px" }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
