// src/app/tools/converters/video-converter/VideoConverterClient.jsx
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * VideoConverterClient
 * - Dynamically loads @ffmpeg/ffmpeg in the browser
 * - Accepts a single video file, converts to chosen format, provides download link
 *
 * Requirements:
 *   npm install @ffmpeg/ffmpeg
 *
 * Notes:
 * - ffmpeg.wasm is heavy. Keep files small for browser conversion.
 * - For production use, prefer server-side conversion.
 */

export default function VideoConverterClient() {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState("mp4");
  const [loadingFFmpeg, setLoadingFFmpeg] = useState(false);
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedUrl, setConvertedUrl] = useState(null);
  const [error, setError] = useState("");
  const ffmpegRef = useRef(null);
  const workerRef = useRef(null);

  useEffect(() => {
    // cleanup object URLs on unmount
    return () => {
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    };
  }, [convertedUrl]);

  async function loadFfmpeg() {
    if (ffmpegRef.current) return ffmpegRef.current;
    setLoadingFFmpeg(true);
    setError("");
    try {
      const { createFFmpeg, fetchFile } = await import("@ffmpeg/ffmpeg");
      const ffmpeg = createFFmpeg({
        log: false,
        corePath: undefined, // use default path shipped by package
      });

      // configure progress callback
      ffmpeg.setProgress((p) => {
        // p.ratio value between 0-1 for current operation
        setProgress(Math.round((p.ratio || 0) * 100));
      });

      // load the ffmpeg core (WASM)
      await ffmpeg.load();
      ffmpegRef.current = { ffmpeg, fetchFile };
      setFfmpegReady(true);
      return ffmpegRef.current;
    } catch (err) {
      console.error("ffmpeg load error", err);
      setError("Failed to load ffmpeg in the browser. Try reloading or use server-side conversion.");
      throw err;
    } finally {
      setLoadingFFmpeg(false);
    }
  }

  async function handleConvert() {
    setError("");
    setConvertedUrl(null);
    setProgress(0);

    if (!file) {
      setError("Please choose a video file first.");
      return;
    }

    // small safeguard for file size
    const maxBytes = 50 * 1024 * 1024; // 50 MB recommended limit for browser conversion
    if (file.size > maxBytes) {
      setError("File too large for browser conversion (recommended ≤ 50 MB). Use a server converter for big files.");
      return;
    }

    try {
      const { ffmpeg, fetchFile } = await loadFfmpeg();

      const inputName = "input" + getExtension(file.name);
      const outputExt = targetFormat.startsWith(".") ? targetFormat : "." + targetFormat;
      const outputName = "output" + outputExt;

      // write file to ffmpeg FS
      ffmpeg.FS("writeFile", inputName, await fetchFile(file));

      // example simple transcode command:
      // - copy audio if possible, re-encode video to target container with libx264 for mp4, vp9/vp8 for webm
      // choose sensible default args per format
      let args;
      if (targetFormat === "mp4") {
        args = ["-i", inputName, "-c:v", "libx264", "-crf", "28", "-preset", "veryfast", "-c:a", "aac", "-b:a", "128k", outputName];
      } else if (targetFormat === "webm") {
        args = ["-i", inputName, "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-c:a", "libopus", outputName];
      } else if (targetFormat === "mov") {
        args = ["-i", inputName, "-c:v", "libx264", "-crf", "28", "-c:a", "aac", outputName];
      } else {
        // generic container copy (may fail if codec incompatible)
        args = ["-i", inputName, "-c", "copy", outputName];
      }

      // run ffmpeg - this may take time
      await ffmpeg.run(...args);

      // read result
      const data = ffmpeg.FS("readFile", outputName);
      const blob = new Blob([data.buffer], { type: getMimeType(targetFormat) });
      const url = URL.createObjectURL(blob);
      setConvertedUrl(url);

      // cleanup FS (optional)
      try {
        ffmpeg.FS("unlink", inputName);
        ffmpeg.FS("unlink", outputName);
      } catch (e) {}
    } catch (err) {
      console.error(err);
      setError("Conversion failed. See console for details.");
    } finally {
      setProgress(0);
    }
  }

  function getMimeType(ext) {
    ext = ext.replace(/^\./, "").toLowerCase();
    if (ext === "mp4") return "video/mp4";
    if (ext === "webm") return "video/webm";
    if (ext === "mov") return "video/quicktime";
    return "application/octet-stream";
  }

  function getExtension(filename) {
    const i = filename.lastIndexOf(".");
    return i >= 0 ? filename.slice(i) : "";
  }

  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
    setConvertedUrl(null);
    setError("");
  }

  function downloadConverted() {
    if (!convertedUrl) return;
    const a = document.createElement("a");
    const ext = targetFormat === "jpeg" ? "jpg" : targetFormat;
    a.href = convertedUrl;
    a.download = `converted${ext ? "." + ext : ""}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="bg-gray-800/40 p-6 rounded-xl max-w-3xl mx-auto">
      <div className="space-y-4">
        <label className="block text-sm text-gray-300">Choose video file</label>
        <input type="file" accept="video/*" onChange={handleFileChange} className="input" />

        <div className="flex gap-3 items-center">
          <label className="text-sm text-gray-300">Target format</label>
          <select value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)} className="input">
            <option value="mp4">MP4 (H.264 + AAC)</option>
            <option value="webm">WebM (VP9/VP8 + Opus)</option>
            <option value="mov">MOV</option>
            <option value="copy">Container copy (no re-encode)</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={handleConvert} disabled={loadingFFmpeg || !file} className="btn btn-primary">
            {loadingFFmpeg ? "Loading converter…" : "Convert in browser"}
          </button>

          <button
            onClick={() => {
              // warm up ffmpeg but don't run anything
              loadFfmpeg().catch(() => {});
            }}
            className="btn btn-secondary"
            disabled={ffmpegReady || loadingFFmpeg}
          >
            {ffmpegReady ? "ffmpeg ready" : "Warm up ffmpeg"}
          </button>
        </div>

        {progress > 0 && (
          <div className="text-sm text-gray-300">Progress: {progress}%</div>
        )}

        {error && <div role="alert" className="text-rose-400 text-sm">{error}</div>}

        {convertedUrl && (
          <div className="mt-4">
            <div className="text-sm text-green-300 mb-2">Conversion finished ✅</div>
            <video src={convertedUrl} controls className="max-w-full rounded mb-2" />
            <div className="flex gap-3">
              <a href={convertedUrl} download className="btn btn-ghost">Download</a>
              <button onClick={downloadConverted} className="btn btn-secondary">Save</button>
              <a href={convertedUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Open</a>
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-400">
          Tip: Browser conversion is experimental — small files are recommended. For production or large files, use server-side ffmpeg.
        </div>
      </div>
    </div>
  );
}
