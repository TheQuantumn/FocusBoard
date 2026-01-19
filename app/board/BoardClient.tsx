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

  // 🔹 Modal + task creation state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function loadTasks() {
    const res = await fetch("/api/tasks", {
      credentials: "include",
    });

    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function createTask() {
    if (!title.trim()) return;

    setCreating(true);

    await fetch("/api/tasks", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    setTitle("");
    setDescription("");
    setCreating(false);
    setShowModal(false);

    await loadTasks();
  }

  async function handleDrop(taskId: string, newStatus: TaskStatus) {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    await loadTasks();
  }

  // 🔥 DELETE ALL COMPLETED TASKS
  async function deleteCompletedTasks() {
    setDeleting(true);

    const completedTasks = tasks.filter(
      (task) => task.status === "COMPLETED"
    );

    for (const task of completedTasks) {
      await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
        credentials: "include",
      });
    }

    setDeleting(false);
    await loadTasks();
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* 🔹 MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "320px",
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
              <h3>Add Task</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "8px",
              }}
            />

            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "12px",
              }}
            />

            <button
              onClick={createTask}
              disabled={creating}
              style={{
                width: "100%",
                padding: "8px",
                cursor: "pointer",
              }}
            >
              {creating ? "Adding..." : "Add Task"}
            </button>
          </div>
        </div>
      )}

      {/* 🔹 KANBAN BOARD */}
      <div style={{ display: "flex", gap: "16px" }}>
        <Column
          title="To Do"
          status="TODO"
          tasks={tasks}
          onDropTask={handleDrop}
          onAddTask={() => setShowModal(true)}
        />

        <Column
          title="Ongoing"
          status="ONGOING"
          tasks={tasks}
          onDropTask={handleDrop}
        />

        <Column
          title="Completed"
          status="COMPLETED"
          tasks={tasks}
          onDropTask={handleDrop}
          onDeleteCompleted={deleteCompletedTasks}
          deleting={deleting}
        />
      </div>
    </div>
  );
}

function Column({
  title,
  status,
  tasks,
  onDropTask,
  onAddTask,
  onDeleteCompleted,
  deleting,
}: {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDropTask: (taskId: string, status: TaskStatus) => void;
  onAddTask?: () => void;
  onDeleteCompleted?: () => void;
  deleting?: boolean;
}) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const taskId = e.dataTransfer.getData("taskId");
        if (taskId) onDropTask(taskId, status);
      }}
      style={{
        flex: 1,
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        minHeight: "200px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <h3>{title}</h3>

        {status === "TODO" && (
          <button onClick={onAddTask} style={{ cursor: "pointer" }}>
            +
          </button>
        )}

        {status === "COMPLETED" && (
          <button
            onClick={onDeleteCompleted}
            disabled={deleting}
            title="Delete all completed tasks"
            style={{ cursor: "pointer" }}
          >
            🗑️
          </button>
        )}
      </div>

      {tasks
        .filter((t) => t.status === status)
        .map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData("taskId", task.id)
            }
            style={{
              padding: "8px",
              marginBottom: "8px",
              background: "#f5f5f5",
              borderRadius: "6px",
              cursor: "grab",
            }}
          >
            <strong>{task.title}</strong>
            <p style={{ fontSize: "12px" }}>{task.description}</p>
          </div>
        ))}
    </div>
  );
}
