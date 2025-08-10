"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      setError(data.error || "Login failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-80"
      >
        <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Login
        </h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          className="w-full p-2 border rounded mb-3 dark:text-black"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 border rounded mb-3 dark:text-black"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mb-3"
        >
          Login
        </button>

        {/* New account creation link */}
        <button
          type="button"
          onClick={() => router.push("/auth/register")}
          className="w-full border border-blue-600 text-blue-600 p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700"
        >
          Create an Account
        </button>
      </form>
    </div>
  );
}
