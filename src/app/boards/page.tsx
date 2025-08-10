"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Board = {
  id: string;
  title: string;
};

export default function BoardsPage() {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  // Fetch boards on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    fetch("/api/boards", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setError("Failed to load boards");
          return;
        }
        setBoards(data);
      })
      .catch(() => setError("Error loading boards"));
  }, [router]);

  const createBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create board");
        return;
      }

      setBoards((prev) => [...prev, data]);
      setTitle("");
    } catch {
      setError("Error creating board");
    }
  };

  const deleteBoard = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (!confirm("Are you sure you want to delete this board?")) return;

    try {
      const res = await fetch(`/api/boards/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setError("Failed to delete board");
        return;
      }

      setBoards((prev) => prev.filter((b) => b.id !== id));
    } catch {
      setError("Error deleting board");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Top action buttons */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-blue-600 underline"
        >
          ← Back to Dashboard
        </button>
        <button
          onClick={handleLogout}
          className="bg-gray-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Your Boards</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* Create board form */}
      <form onSubmit={createBoard} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="New board title"
          className="flex-1 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      {/* List boards */}
      <ul className="space-y-2">
        {boards.map((board) => (
          <li
            key={board.id}
            className="flex justify-between items-center text-black p-3 border rounded hover:bg-gray-50 cursor-pointer"
          >
            <span
              onClick={() => router.push(`/boards/${board.id}`)}
              className="flex-1 text-black"
            >
              {board.title}
            </span>
            <button
              onClick={() => deleteBoard(board.id)}
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
