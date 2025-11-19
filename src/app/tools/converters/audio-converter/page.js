// src/app/tools/converters/audio-converter/page.js
export const metadata = {
  title: "Audio Converter — Convert to MP3, WAV, OGG (Client-side)",
  description:
    "Convert audio files to MP3, WAV or OGG directly in your browser using ffmpeg.wasm. Private, fast for small files, and easy to use — no upload required.",
};

import AudioConverterClient from "./AudioConverterClient";

export default function AudioConverterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-3 text-blue-400">Audio Converter</h1>

        <p className="text-gray-300 mb-6">
          Convert audio files (WAV, M4A, AAC, etc.) to MP3, WAV or OGG in your browser. This client-side
          converter uses a WebAssembly build of FFmpeg, keeping your files private. Note: browser
          conversion can be slow for large files — recommended for short clips and testing.
        </p>

        <AudioConverterClient />

        <section className="mt-8 text-gray-400">
          <h2 className="text-xl font-semibold mb-2">Notes & limitations</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>ffmpeg.wasm downloads a runtime (several MB). Expect a one-time download when initializing.</li>
            <li>Works best with files ≤ 30–50 MB. Larger files may run out of memory or take a long time.</li>
            <li>For heavy or production conversions, use a server-side FFmpeg service instead.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
