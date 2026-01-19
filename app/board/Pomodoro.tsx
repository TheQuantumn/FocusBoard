"use client";

import { useEffect, useRef, useState } from "react";

export default function Pomodoro() {
  const [studyTime, setStudyTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);

  const [mode, setMode] = useState<"FOCUS" | "BREAK">("FOCUS");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [showSettings, setShowSettings] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🔹 Load saved settings
  useEffect(() => {
    fetch("/api/pomodoro", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.studyTime) {
          setStudyTime(data.studyTime);
          setBreakTime(data.breakTime);
          setSecondsLeft(data.studyTime * 60);
        }
      });
  }, []);

  // 🔹 Timer engine
  useEffect(() => {
    if (!isRunning || showSettings) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          switchMode();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, showSettings]);

  function switchMode() {
    if (mode === "FOCUS") {
      setMode("BREAK");
      setSecondsLeft(breakTime * 60);
    } else {
      setMode("FOCUS");
      setSecondsLeft(studyTime * 60);
    }
  }

  function skipBreak() {
    setMode("FOCUS");
    setSecondsLeft(studyTime * 60);
  }

  async function saveSettings() {
    await fetch("/api/pomodoro", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studyTime, breakTime }),
    });

    setMode("FOCUS");
    setSecondsLeft(studyTime * 60);
    setShowSettings(false);
  }

  function reset() {
    setIsRunning(false);
    setSecondsLeft(
      mode === "FOCUS" ? studyTime * 60 : breakTime * 60
    );
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        maxWidth: "280px",
        position: "relative",
      }}
    >
      {/* ⚙️ SETTINGS ICON */}
      <button
        onClick={() => {
          setIsRunning(false);
          setShowSettings(true);
        }}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          cursor: "pointer",
        }}
      >
        ⚙️
      </button>

      <h3>Pomodoro</h3>
      <p style={{ fontWeight: "bold" }}>
        {mode === "FOCUS" ? "FOCUS NOW" : "BREAK"}
      </p>

      <h2>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </h2>

      <div style={{ marginBottom: "12px" }}>
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={reset} style={{ marginLeft: "8px" }}>
          Reset
        </button>
      </div>

      {mode === "BREAK" && (
        <button onClick={skipBreak}>Skip Break</button>
      )}

      {/* 🔹 SETTINGS MODAL */}
      {showSettings && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "260px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <h4>Settings</h4>
              <button onClick={() => setShowSettings(false)}>✕</button>
            </div>

            <label>
              Study (min)
              <input
                type="number"
                value={studyTime}
                onChange={(e) =>
                  setStudyTime(Number(e.target.value))
                }
                style={{ width: "100%", marginBottom: "8px" }}
              />
            </label>

            <label>
              Break (min)
              <input
                type="number"
                value={breakTime}
                onChange={(e) =>
                  setBreakTime(Number(e.target.value))
                }
                style={{ width: "100%", marginBottom: "12px" }}
              />
            </label>

            <button
              onClick={saveSettings}
              style={{ width: "100%" }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
