import "./globals.css";
import { ThemeProvider } from "@/lib/useTheme";
import DarkModeToggle from "@/component/DarkModeToggle";

export const metadata = {
  title: "My TaskBoard",
  description: "Task board app built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-200">
        <ThemeProvider>
          {/* Global Header */}
          <header className="flex justify-end p-4 border-b dark:border-gray-700">
            <DarkModeToggle />
          </header>

          {/* Page content */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
