"use client";

import { useEffect, useState } from "react";

type TaskStatus = "TODO" | "ONGOING" | "COMPLETED";

type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
};

export default function BoardClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);

  async function loadTasks() {
    const res = await fetch("/api/tasks", { credentials: "include" });
    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function createTask() {
    if (!title.trim()) return;

    await fetch("/api/tasks", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    setTitle("");
    setDescription("");
    setShowAdd(false);
    await loadTasks();
  }

  async function deleteCompleted() {
    const completed = tasks.filter((t) => t.status === "COMPLETED");

    await Promise.all(
      completed.map((t) =>
        fetch(`/api/tasks/${t.id}`, {
          method: "DELETE",
          credentials: "include",
        })
      )
    );

    await loadTasks();
  }

  async function handleDrop(taskId: string, newStatus: TaskStatus) {
    setDragOverStatus(null);

    await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    await loadTasks();
  }

  if (loading) return <p className="muted">Loading…</p>;

  return (
    <>
      {/* ================= BOARD ================= */}
      <div className="card">
        <h2 style={{ marginBottom: "20px" }}>Task Board</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          <Column
            title="To Do"
            status="TODO"
            tasks={tasks}
            draggingId={draggingId}
            dragOverStatus={dragOverStatus}
            setDragOverStatus={setDragOverStatus}
            onDropTask={handleDrop}
            onDragStart={setDraggingId}
            onDragEnd={() => setDraggingId(null)}
            rightAction={<button onClick={() => setShowAdd(true)}>＋</button>}
          />

          <Column
            title="Ongoing"
            status="ONGOING"
            tasks={tasks}
            draggingId={draggingId}
            dragOverStatus={dragOverStatus}
            setDragOverStatus={setDragOverStatus}
            onDropTask={handleDrop}
            onDragStart={setDraggingId}
            onDragEnd={() => setDraggingId(null)}
          />

          <Column
            title="Completed"
            status="COMPLETED"
            tasks={tasks}
            draggingId={draggingId}
            dragOverStatus={dragOverStatus}
            setDragOverStatus={setDragOverStatus}
            onDropTask={handleDrop}
            onDragStart={setDraggingId}
            onDragEnd={() => setDraggingId(null)}
            rightAction={<button onClick={deleteCompleted}>🗑</button>}
          />
        </div>
      </div>

      {/* ================= MODAL (VIEWPORT) ================= */}
      {showAdd && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "360px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "14px",
              padding: "22px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: 600 }}>Add Task</div>
              <button
                onClick={() => setShowAdd(false)}
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

            <input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />

            <button onClick={createTask}>Add Task</button>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= COLUMN ================= */

function Column({
  title,
  status,
  tasks,
  draggingId,
  dragOverStatus,
  setDragOverStatus,
  onDropTask,
  onDragStart,
  onDragEnd,
  rightAction,
}: {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  draggingId: string | null;
  dragOverStatus: TaskStatus | null;
  setDragOverStatus: (s: TaskStatus | null) => void;
  onDropTask: (taskId: string, status: TaskStatus) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  rightAction?: React.ReactNode;
}) {
  const isDragOver = dragOverStatus === status;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOverStatus(status);
      }}
      onDrop={(e) => {
        const taskId = e.dataTransfer.getData("taskId");
        if (taskId) onDropTask(taskId, status);
      }}
      style={{
        border: "1px solid var(--border-subtle)",
        borderRadius: "14px",
        padding: "16px",
        minHeight: "360px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        background: isDragOver
          ? "rgba(255,255,255,0.03)"
          : "transparent",
        transition: "background 120ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="section-label">{title}</div>
        {rightAction}
      </div>

      {tasks
        .filter((t) => t.status === status)
        .map((task) => {
          const isDragging = draggingId === task.id;

          return (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("taskId", task.id);
                onDragStart(task.id);
              }}
              onDragEnd={onDragEnd}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderLeft: `4px solid ${
                  status === "TODO"
                    ? "var(--accent-blue)"
                    : status === "ONGOING"
                    ? "var(--accent-purple)"
                    : "var(--accent-green)"
                }`,
                borderRadius: "10px",
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                cursor: "grab",
                opacity: isDragging ? 0.5 : 1,
                transform: isDragging ? "scale(0.97)" : "scale(1)",
                transition:
                  "transform 120ms ease, opacity 120ms ease, background 120ms ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--bg-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--bg-card)")
              }
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                {task.title}
              </div>

              {task.description && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    lineHeight: 1.4,
                  }}
                >
                  {task.description}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
