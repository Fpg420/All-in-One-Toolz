"use client";
export const dynamic = "force-dynamic"; // prevent Next.js from prerendering this page

import { useState } from "react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

export default function AudioConverter() {
  const [ffmpeg, setFFmpeg] = useState(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [outputUrl, setOutputUrl] = useState(null);
  const [error, setError] = useState("");

  const loadFFmpeg = async () => {
    if (!ready) {
      try {
        setLoading(true);

        // 🧠 dynamically import ffmpeg in browser only
        const { FFmpeg } = await import("@ffmpeg/ffmpeg");
        const { fetchFile } = await import("@ffmpeg/util");

        const instance = new FFmpeg();
        await instance.load();

        // Save instance and helper function
        setFFmpeg({ instance, fetchFile });
        setReady(true);
      } catch (err) {
        console.error("FFmpeg load error:", err);
        setError("Failed to load FFmpeg. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleConvert = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !ffmpeg) return;

    setError("");
    setOutputUrl(null);
    setLoading(true);

    try {
      const { instance, fetchFile } = ffmpeg;

      try {
        await instance.deleteFile("input.wav");
        await instance.deleteFile("output.mp3");
      } catch {}

      const fileData = await fetchFile(file);
      await instance.writeFile("input.wav", fileData);

      await instance.exec(["-i", "input.wav", "-acodec", "libmp3lame", "output.mp3"]);

      const data = await instance.readFile("output.mp3");
      const url = URL.createObjectURL(new Blob([data.buffer], { type: "audio/mpeg" }));

      setOutputUrl(url);
    } catch (err) {
      console.error("Conversion failed:", err);
      setError("Conversion failed. Try another file or format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Audio Converter"
      description="Convert your audio files to MP3 directly in your browser using FFmpeg."
    >
      <div className="space-y-6 text-center">
        {!ready && (
          <button
            onClick={loadFFmpeg}
            className="px-4 py-2 bg-green-700 text-white rounded-xl shadow hover:bg-green-600 transition"
            disabled={loading}
          >
            {loading ? "Loading FFmpeg..." : "Initialize Converter"}
          </button>
        )}

        {ready && (
          <div>
            <input
              type="file"
              accept="audio/*"
              onChange={handleConvert}
              className="border p-2 rounded-lg cursor-pointer"
            />
          </div>
        )}

        {loading && <p className="text-gray-400">Processing...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {outputUrl && (
          <div className="mt-4">
            <audio controls src={outputUrl} className="mx-auto"></audio>
            <a
              href={outputUrl}
              download="converted.mp3"
              className="block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
            >
              Download Converted File
            </a>
          </div>
        )}
      </div>
    </ToolPageTemplate>
  );
}
