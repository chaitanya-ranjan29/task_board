"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Board, Task } from "@/lib/data";

export default function BoardTasksPage() {
  const { id: boardId } = useParams();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [boardTitle, setBoardTitle] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  // Load tasks + board title
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    Promise.all([
      fetch(`/api/tasks?boardId=${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch(`/api/boards`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    ])
      .then(([tasksData, boardsData]) => {
        if (Array.isArray(tasksData)) {
          setTasks(tasksData);
        } else {
          setError("Failed to load tasks");
        }

        if (Array.isArray(boardsData)) {
          const currentBoard = boardsData.find((b: Board) => b.id === boardId);
          if (currentBoard) {
            setBoardTitle(currentBoard.title);
          }
        }
      })
      .catch(() => setError("Error loading tasks or board"));
  }, [boardId, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          boardId,
          title,
          description,
          dueDate: dueDate || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create task");
        return;
      }

      setTasks((prev) => [...prev, data]);
      setTitle("");
      setDescription("");
      setDueDate("");
    } catch {
      setError("Error creating task");
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: currentStatus === "pending" ? "completed" : "pending",
        }),
      });

      if (!res.ok) return;

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: currentStatus === "pending" ? "completed" : "pending",
              }
            : t
        )
      );
    } catch {
      setError("Error updating task status");
    }
  };

  const deleteTask = async (taskId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch {
      setError("Error deleting task");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Top actions */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.push("/boards")}
          className="text-blue-600 underline"
        >
          ← Back to Boards
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">{boardTitle || "Tasks"}</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* Create Task Form */}
      <form onSubmit={createTask} className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="Task title"
          className="w-full p-2 border rounded dark:text-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description (optional)"
          className="w-full p-2 border rounded dark:text-black"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          className="w-full p-2 border rounded  dark:text-black"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center p-3 border rounded"
          >
            <div>
              <input
                type="checkbox"
                checked={task.status === "completed"}
                onChange={() => toggleTaskStatus(task.id, task.status)}
                className="mr-2"
              />
              <span
                className={task.status === "completed" ? "line-through" : ""}
              >
                {task.title}
              </span>
              {task.dueDate && (
                <small className="ml-2 text-gray-500">
                  (Due: {task.dueDate})
                </small>
              )}
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
