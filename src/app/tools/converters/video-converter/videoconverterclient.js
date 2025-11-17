// /tools/converters/video-converter/VideoConverterClient.js
"use client";

import { useState } from "react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

export default function VideoConverter() {
  const [ffmpeg, setFfmpeg] = useState(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [outputUrl, setOutputUrl] = useState(null);
  const [error, setError] = useState("");

  const loadFFmpeg = async () => {
    if (!ready) {
      setLoading(true);
      try {
        const { createFFmpeg, fetchFile } = await import("@ffmpeg/ffmpeg");
        const ffmpegInstance = createFFmpeg({ log: true });
        await ffmpegInstance.load();
        setFfmpeg({ ffmpegInstance, fetchFile });
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
    if (!ffmpeg) return;
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setOutputUrl(null);

    try {
      const { ffmpegInstance, fetchFile } = ffmpeg;

      try {
        await ffmpegInstance.deleteFile("input.mp4");
        await ffmpegInstance.deleteFile("output.mp3");
      } catch {}

      const fileData = await fetchFile(file);
      await ffmpegInstance.writeFile("input.mp4", fileData);

      await ffmpegInstance.exec(["-i", "input.mp4", "-vn", "-acodec", "libmp3lame", "output.mp3"]);

      const data = await ffmpegInstance.readFile("output.mp3");
      const url = URL.createObjectURL(new Blob([data.buffer], { type: "audio/mpeg" }));
      setOutputUrl(url);
    } catch (err) {
      console.error(err);
      setError("Conversion failed. Try a smaller file or refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Video Converter"
      description="Convert videos to MP3 easily in your browser using FFmpeg."
    >
      <div className="space-y-6 text-center">
        {!ready && (
          <button onClick={loadFFmpeg} disabled={loading} className="px-4 py-2 bg-green-700 text-white rounded-xl shadow hover:bg-green-600 transition">
            {loading ? "Loading FFmpeg..." : "Initialize Converter"}
          </button>
        )}

        {ready && (
          <div>
            <input
              type="file"
              accept="video/*"
              onChange={handleConvert}
              className="border p-2 rounded-lg cursor-pointer"
            />
          </div>
        )}

        {loading && <p className="text-gray-400">Processing...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {outputUrl && (
          <div className="mt-4">
            <a href={outputUrl} download="converted.mp3" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition">
              Download Converted File
            </a>
          </div>
        )}
      </div>
    </ToolPageTemplate>
  );
}
