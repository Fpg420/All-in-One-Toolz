// src/app/tools/converters/audio-converter/AudioConverterClient.jsx
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * AudioConverterClient
 * - Dynamically loads @ffmpeg/ffmpeg in the browser (createFFmpeg + fetchFile)
 * - Supports converting an uploaded audio file into mp3, wav or ogg
 * - Shows load/progress states and provides preview + download
 *
 * Requirements:
 *   npm install @ffmpeg/ffmpeg
 *
 * Notes:
 * - Browser conversion is CPU/memory intensive. Use small files for best experience.
 */

export default function AudioConverterClient() {
  const [ffmpeg, setFfmpeg] = useState(null); // { ffmpeg, fetchFile }
  const [isLoading, setIsLoading] = useState(false); // loading ffmpeg core or processing
  const [isReady, setIsReady] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("mp3");
  const [outputUrl, setOutputUrl] = useState(null);
  const [error, setError] = useState("");
  const inputFileRef = useRef(null);

  useEffect(() => {
    return () => {
      // cleanup created object URLs when component unmounts
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  async function initFfmpeg() {
    if (ffmpeg || isLoading) return;
    setError("");
    setIsLoading(true);

    try {
      const { createFFmpeg, fetchFile } = await import("@ffmpeg/ffmpeg");
      const ff = createFFmpeg({
        log: false,
        progress: ({ ratio }) => {
          // ratio is 0..1 for ffmpeg operations while running
          setProgressPct(Math.round((ratio || 0) * 100));
        },
      });

      await ff.load();
      setFfmpeg({ ffmpeg: ff, fetchFile });
      setIsReady(true);
    } catch (err) {
      console.error("Failed to load ffmpeg:", err);
      setError("Failed to load FFmpeg in the browser. Try reloading the page.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleFileSelect(ev) {
    setError("");
    setOutputUrl(null);
    const f = ev.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("audio/") && !f.type.startsWith("video/")) {
      setError("Please select an audio or video file.");
      return;
    }
    // optional limit
    const MAX = 50 * 1024 * 1024; // 50 MB
    if (f.size > MAX) {
      setError("File too large. Please use a smaller file (recommended ≤ 50 MB).");
      return;
    }
    setFile(f);
  }

  async function convert() {
    setError("");
    setOutputUrl(null);

    if (!file) return setError("Choose a file first.");
    if (!ffmpeg) {
      await initFfmpeg();
      if (!ffmpeg) {
        return setError("FFmpeg failed to initialize.");
      }
    }

    setIsLoading(true);
    setProgressPct(0);

    try {
      const { ffmpeg, fetchFile } = ffmpeg || (await import("@ffmpeg/ffmpeg").then(m => ({ ffmpeg: m.createFFmpeg({ log: false }), fetchFile: m.fetchFile }))); // fallback (shouldn't be needed)
      const inputName = "input" + getExt(file.name);
      const outExt = outputFormat === "mp3" ? ".mp3" : outputFormat === "wav" ? ".wav" : ".ogg";
      const outName = "output" + outExt;

      // write file
      ffmpeg.FS("writeFile", inputName, await fetchFile(file));

      // choose arguments according to output format
      let args;
      if (outputFormat === "mp3") {
        // convert to mp3 using libmp3lame
        args = ["-i", inputName, "-vn", "-acodec", "libmp3lame", "-q:a", "2", outName];
      } else if (outputFormat === "wav") {
        args = ["-i", inputName, "-vn", "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2", outName];
      } else if (outputFormat === "ogg") {
        args = ["-i", inputName, "-vn", "-c:a", "libvorbis", "-q:a", "5", outName];
      } else {
        // fallback: copy audio stream if possible
        args = ["-i", inputName, "-vn", "-c:a", "copy", outName];
      }

      await ffmpeg.run(...args);

      // read output
      const data = ffmpeg.FS("readFile", outName);
      const blob = new Blob([data.buffer], { type: getMime(outExt) });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);

      // cleanup FS
      try {
        ffmpeg.FS("unlink", inputName);
        ffmpeg.FS("unlink", outName);
      } catch (e) {
        /* ignore FS cleanup errors */
      }
    } catch (err) {
      console.error("Conversion error:", err);
      setError("Conversion failed. Try a different file or format.");
    } finally {
      setIsLoading(false);
      setProgressPct(0);
    }
  }

  function getExt(name) {
    const i = name.lastIndexOf(".");
    return i >= 0 ? name.slice(i) : "";
  }

  function getMime(ext) {
    const e = ext.replace(/^\./, "").toLowerCase();
    if (e === "mp3") return "audio/mpeg";
    if (e === "wav") return "audio/wav";
    if (e === "ogg") return "audio/ogg";
    return "application/octet-stream";
  }

  function downloadOutput() {
    if (!outputUrl) return;
    const a = document.createElement("a");
    const ext = outputFormat === "mp3" ? "mp3" : outputFormat === "wav" ? "wav" : "ogg";
    a.href = outputUrl;
    a.download = `converted.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="bg-gray-800/40 p-6 rounded-xl max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <button
            onClick={initFfmpeg}
            disabled={isReady || isLoading}
            className="btn btn-secondary"
          >
            {isReady ? "FFmpeg ready" : isLoading ? "Initializing..." : "Initialize FFmpeg"}
          </button>

          <label className="flex items-center gap-2 text-sm">
            <span className="text-gray-300">Output format</span>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="input"
            >
              <option value="mp3">MP3</option>
              <option value="wav">WAV</option>
              <option value="ogg">OGG</option>
            </select>
          </label>

          <input
            ref={inputFileRef}
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileSelect}
            className="input"
          />
        </div>

        {progressPct > 0 && (
          <div className="text-sm text-gray-300">Progress: {progressPct}%</div>
        )}

        {error && <div role="alert" className="text-rose-400 text-sm">{error}</div>}

        <div className="flex gap-3">
          <button onClick={convert} disabled={isLoading || !file} className="btn btn-primary">
            {isLoading ? "Converting…" : "Convert"}
          </button>

          <button
            onClick={() => {
              setFile(null);
              setOutputUrl(null);
              setError("");
              if (inputFileRef.current) inputFileRef.current.value = "";
            }}
            className="btn btn-secondary"
          >
            Clear
          </button>

          {outputUrl && (
            <>
              <button onClick={downloadOutput} className="btn btn-ghost">Download</button>
              <a href={outputUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Open</a>
            </>
          )}
        </div>

        {outputUrl && (
          <div className="mt-4">
            <p className="text-sm text-green-300 mb-2">Conversion complete ✅</p>
            <audio controls src={outputUrl} className="w-full" />
          </div>
        )}

        <div className="text-xs text-gray-400 mt-3">
          Tip: For large/long audio files use a server-side ffmpeg or a dedicated conversion API.
        </div>
      </div>
    </div>
  );
}
