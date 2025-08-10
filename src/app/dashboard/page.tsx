"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Board } from "@/lib/data";

export default function DashboardPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [title, setTitle] = useState("");
  const router = useRouter();

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
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/auth/login");
          }
          return [];
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setBoards(data);
        }
      })
      .catch((err) => console.error("Error fetching boards:", err));
  }, [router]);

  // Create new board
  const createBoard = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const res = await fetch("/api/boards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    if (res.ok) {
      const newBoard = await res.json();
      setBoards((prev) => [...prev, newBoard]);
      setTitle("");
    }
  };

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Your Boards</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Create board */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="New board title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={createBoard}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {/* Boards list */}
      {boards.length === 0 ? (
        <p>No boards yet. Create one!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {boards.map((board) => (
            <div
              key={board.id}
              onClick={() => router.push(`/boards/${board.id}`)}
              className="p-4 border rounded shadow hover:bg-gray-50 cursor-pointer"
            >
              {board.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
