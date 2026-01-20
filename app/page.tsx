import DarkVeil from "./components/DarkVeil";

export default function HomePage() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--bg-main)",
        overflow: "hidden",
        isolation: "isolate", // 🔑 forces correct stacking
      }}
    >
      {/* ===== BACKGROUND ===== */}
      <DarkVeil />

     

      {/* ===== HERO CONTENT ===== */}
     <section
  style={{
    position: "relative",
    zIndex: 2,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 24px",
    textAlign: "center",
  }}
>
  <div
    style={{
      maxWidth: "1100px",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "28px",
    }}
  >
    {/* Badge */}
    <div
      style={{
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.12em",
        color: "var(--accent-purple)",
        textTransform: "uppercase",
      }}
    >
      Productivity • Focus • Flow
    </div>

    {/* Headline */}
    <h1
      style={{
        fontSize: "56px",
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: "-0.03em",
        maxWidth: "900px",
        margin: 0,
      }}
    >
      Focus better.
      <br />
      Get things done.
    </h1>

    {/* Subheading */}
    <p
      style={{
        fontSize: "18px",
        color: "var(--text-secondary)",
        maxWidth: "640px",
        lineHeight: 1.6,
        margin: 0,
      }}
    >
      FocusBoard is a modern productivity dashboard with a Pomodoro timer,
      Kanban task board, and ambient focus tools — built for deep work.
    </p>

    {/* CTAs */}
    <div style={{ display: "flex", gap: "14px", marginTop: "12px" }}>
      <a
        href="/signup"
        style={{
          background: "var(--accent-purple)",
          color: "#000",
          padding: "12px 20px",
          borderRadius: "10px",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Get Started
      </a>

      <a
        href="/login"
        style={{
          border: "1px solid var(--border-subtle)",
          padding: "12px 20px",
          borderRadius: "10px",
          fontWeight: 600,
          color: "var(--text-primary)",
          textDecoration: "none",
        }}
      >
        Log in
      </a>
    </div>

    {/* Footer text */}
    <div
      style={{
        marginTop: "24px",
        fontSize: "13px",
        color: "var(--text-muted)",
      }}
    >
      Built with Next.js • TypeScript • Prisma
    </div>
  </div>
</section>

    </main>
  );
}
