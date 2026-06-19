import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Companion | Empowering your academic journey",
  description: "R-AI Student Companion - Empathetic Expert AI-driven study planner, career advisor, and mentor tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-surface text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
