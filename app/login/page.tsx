"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DarkVeil from "../components/DarkVeil";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data?.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // ✅ success
      router.push("/board");
    } catch (err) {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
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
        <DarkVeil speed={0.25} warpAmount={0.12} noiseIntensity={0.02} />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(11,11,15,0.7), rgba(11,11,15,0.9))",
          }}
        />
      </div>

      {/* ===== CONTENT ===== */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          className="card"
          style={{
            width: "420px",
            padding: "36px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            backdropFilter: "blur(6px)",
            background:
              "linear-gradient(180deg, rgba(20,20,26,0.9), rgba(20,20,26,0.8))",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "6px" }}>
            <div
              style={{
                fontSize: "12px",
                letterSpacing: "0.12em",
                fontWeight: 600,
                color: "var(--accent-purple)",
                marginBottom: "8px",
                textTransform: "uppercase",
              }}
            >
              Welcome back
            </div>

            <h2 style={{ fontSize: "26px" }}>Log in to FocusBoard</h2>
          </div>

          {/* Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-main)",
                color: "var(--text-primary)",
              }}
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-main)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                fontSize: "13px",
                color: "var(--accent-pink)",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {/* Action */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              marginTop: "6px",
              background: "var(--accent-purple)",
              border: "none",
              padding: "12px",
              borderRadius: "10px",
              fontWeight: 600,
              color: "#000",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Logging in…" : "Log in"}
          </button>

          {/* Footer */}
          <div
            style={{
              marginTop: "10px",
              textAlign: "center",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            Don’t have an account?{" "}
            <a
              href="/signup"
              style={{
                color: "var(--accent-purple)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign up
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
