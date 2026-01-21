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
      {/* ================= MOBILE RESPONSIVE STYLES ================= */}
      <style>{`
        .kanban-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 768px) {
          .kanban-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ================= BOARD ================= */}
      <div className="card">
        <h2 style={{ marginBottom: "20px" }}>Task Board</h2>

        <div className="kanban-grid">
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

      {/* ================= MODAL ================= */}
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 600 }}>Add Task</div>
              <button
                onClick={() => setShowAdd(false)}
                style={{ background: "transparent", border: "none" }}
              >
                ✕
              </button>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Description (optional)"
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowAdd(false)}>Cancel</button>
              <button onClick={createTask}>Add Task</button>
            </div>
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
        background: isDragOver ? "rgba(255,255,255,0.03)" : "transparent",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="section-label">{title}</div>
        {rightAction}
      </div>

      {tasks
        .filter((t) => t.status === status)
        .map((task) => (
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
              padding: "12px",
              cursor: "grab",
              opacity: draggingId === task.id ? 0.5 : 1,
            }}
          >
            <div style={{ fontWeight: 600 }}>{task.title}</div>
            {task.description && (
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {task.description}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
