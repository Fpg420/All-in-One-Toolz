"use client";
import { useState } from "react";
import Link from "next/link";

export default function YouTubeDownloader() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const match = url.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (match && match[1]) {
      setVideoId(match[1]);
    } else {
      setError("Please enter a valid YouTube URL.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">🎥 YouTube Video Downloader</h1>

      <Link href="/" className="text-blue-400 hover:underline mb-6">
        ← Back to Home
      </Link>

      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter YouTube video URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 rounded-lg text-black mb-3"
        />
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-2 rounded-lg"
        >
          Get Video Info
        </button>
      </form>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {videoId && (
        <div className="bg-gray-800 p-4 rounded-xl mt-6 shadow-lg w-full max-w-md text-center">
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="Thumbnail"
            className="rounded-lg mb-3 w-full"
          />
          <p className="mb-3">Video ID: {videoId}</p>
          <a
  href={`https://ssyoutube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg inline-block"
          >
            Download Video 🔽
          </a>
        </div>
      )}
    </main>
  );
}
