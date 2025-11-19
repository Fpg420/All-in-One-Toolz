// src/app/tools/converters/video-converter/page.js
export const metadata = {
  title: "Video Converter — Convert MP4, WebM, MOV (client-side)",
  description:
    "Convert short videos between MP4, WebM, MOV and other formats directly in your browser using ffmpeg.wasm. For large files use a server-side transcode.",
};

import VideoConverterClient from "./VideoConverterClient";

export default function VideoConverterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-3 text-blue-400">Video Converter</h1>

        <p className="text-gray-300 mb-6">
          Convert short videos between common formats (mp4, webm, mov) right in your browser.
          This page uses a client-side WebAssembly build of ffmpeg (ffmpeg.wasm). Client-side
          conversion keeps your file private (no uploads) but can be slow and uses a lot of memory.
          For large files or production use consider server-side ffmpeg.
        </p>

        <VideoConverterClient />

        <section className="mt-8 text-gray-400">
          <h2 className="text-xl font-semibold mb-2">Notes & Limitations</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>ffmpeg.wasm downloads a large runtime (several MB). Expect a noticeable initial load.</li>
            <li>Client-side convert is best for short videos (≤ 10–20 MB). Large files may fail or freeze the browser.</li>
            <li>If you need a production-grade converter, run ffmpeg on a server or use a conversion API.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
