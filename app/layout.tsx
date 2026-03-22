import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yogi The Editor — AI Video Generator",
  description: "Automate Your Video. Elevate Your Brand.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
