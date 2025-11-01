"use client";

import Link from "next/link";

export default function Home() {
  const tools = [
    { name: "Calculator", path: "/calculator", emoji: "🧮" },
    { name: "YouTube Downloader", path: "/youtube-downloader", emoji: "🎥" },
    { name: "File Converter", path: "/file-converter", emoji: "🔄" },
    { name: "Instagram DP Downloader", path: "/insta-dp", emoji: "📸" },
    { name: "QR Code Generator", path: "/qr-generator", emoji: "🔳" },
    { name: "Text to Speech", path: "/text-to-speech", emoji: "🗣️" },
    { name: "Password Generator", path: "/password-generator", emoji: "🔐" },
    { name: "Unit Converter", path: "/unit-converter", emoji: "⚙️" },
  ];

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">
        ⚡ All n One Toolz ⚡
      </h1>
      <p className="text-gray-400 mb-8 text-center max-w-lg">
        One place for all your handy online tools — calculators, converters, downloaders, and more!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            href={tool.path}
            className="bg-gray-800 hover:bg-gray-700 p-6 rounded-2xl text-center shadow-md transition"
          >
            <div className="text-4xl mb-2">{tool.emoji}</div>
            <div className="text-xl font-semibold">{tool.name}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
