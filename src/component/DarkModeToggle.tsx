"use client";

import { useTheme } from "@/lib/useTheme";

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 border rounded dark:border-gray-500"
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
