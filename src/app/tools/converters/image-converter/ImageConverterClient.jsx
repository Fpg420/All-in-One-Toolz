// src/app/tools/converters/image-converter/ImageConverterClient.jsx
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Client-side image converter:
 * - Drag & drop or file input
 * - Preview original + converted
 * - Output formats: png, jpeg, webp
 * - Resize with max width/height while preserving aspect ratio
 * - Quality slider (for jpeg/webp)
 * - Downloads converted file
 */

const MIME_FOR = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

export default function ImageConverterClient() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [format, setFormat] = useState("png");
  const [quality, setQuality] = useState(0.9); // 0..1 (used for jpeg/webp)
  const [maxWidth, setMaxWidth] = useState("");
  const [maxHeight, setMaxHeight] = useState("");
  const [convertedUrl, setConvertedUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const dropRef = useRef(null);

  useEffect(() => {
    // revoke preview/converted object URLs on unmount or change
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    };
  }, [previewUrl, convertedUrl]);

  function handleFileInput(f) {
    setError("");
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    // optional size limit (5 MB)
    const maxBytes = 5 * 1024 * 1024;
    if (f.size > maxBytes) {
      setError("File is too large. Maximum 5 MB recommended.");
      return;
    }
    setFile(f);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(f));
    // clear previous converted
    if (convertedUrl) {
      URL.revokeObjectURL(convertedUrl);
      setConvertedUrl(null);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFileInput(f);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  async function convert() {
    setError("");
    if (!file) {
      setError("No image selected.");
      return;
    }
    setProcessing(true);

    try {
      const img = await loadImage(previewUrl || URL.createObjectURL(file));
      // compute target size keeping aspect ratio if maxWidth/Height provided
      let targetWidth = img.width;
      let targetHeight = img.height;

      const mw = Number(maxWidth) || 0;
      const mh = Number(maxHeight) || 0;

      if (mw > 0 && mh > 0) {
        // fit within both
        const ratio = Math.min(mw / img.width, mh / img.height, 1);
        targetWidth = Math.round(img.width * ratio);
        targetHeight = Math.round(img.height * ratio);
      } else if (mw > 0) {
        const ratio = Math.min(mw / img.width, 1);
        targetWidth = Math.round(img.width * ratio);
        targetHeight = Math.round(img.height * ratio);
      } else if (mh > 0) {
        const ratio = Math.min(mh / img.height, 1);
        targetWidth = Math.round(img.width * ratio);
        targetHeight = Math.round(img.height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      // draw with smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // convert to blob
      const mime = MIME_FOR[format] || "image/png";
      const qualityValue = mime === "image/png" ? undefined : Math.max(0.01, Math.min(1, quality));
      const blob = await canvasToBlobAsync(canvas, mime, qualityValue);

      // revoke previous converted URL
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
      const url = URL.createObjectURL(blob);
      setConvertedUrl(url);
    } catch (err) {
      console.error(err);
      setError("Conversion failed. Try a different image or format.");
    } finally {
      setProcessing(false);
    }
  }

  function canvasToBlobAsync(canvas, mime, q) {
    return new Promise((resolve, reject) => {
      if (canvas.toBlob.length === 3) {
        // browser supports quality param
        try {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else reject(new Error("Failed to create blob"));
            },
            mime,
            q
          );
        } catch (e) {
          reject(e);
        }
      } else {
        // fallback: use toDataURL then convert
        try {
          const data = canvas.toDataURL(mime, q);
          const blob = dataURLToBlob(data);
          resolve(blob);
        } catch (e) {
          reject(e);
        }
      }
    });
  }

  function dataURLToBlob(dataurl) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = src;
    });
  }

  function download() {
    if (!convertedUrl) return;
    const ext = format === "jpeg" ? "jpg" : format;
    const a = document.createElement("a");
    a.href = convertedUrl;
    a.download = `converted.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function clearAll() {
    setFile(null);
    setError("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (convertedUrl) {
      URL.revokeObjectURL(convertedUrl);
      setConvertedUrl(null);
    }
    setMaxWidth("");
    setMaxHeight("");
  }

  return (
    <div className="bg-gray-800/40 p-6 rounded-xl max-w-3xl mx-auto">
      <div
        ref={dropRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="border-2 border-dashed border-gray-700 rounded p-4 mb-4 text-center"
        role="region"
        aria-label="Image upload"
      >
        <p className="text-sm text-gray-300 mb-2">Drag & drop an image here — or use the file picker</p>

        <input
          aria-label="Choose image file"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileInput(e.target.files && e.target.files[0])}
          className="mb-3"
        />

        {previewUrl && (
          <div className="mb-3">
            <div className="text-sm text-gray-300 mb-2">Original preview</div>
            <img src={previewUrl} alt="preview" className="max-w-full rounded shadow" />
          </div>
        )}

        <div className="flex gap-3 justify-center items-center">
          <label className="flex items-center gap-2 text-sm">
            Output:
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="input">
              <option value="png">PNG</option>
              <option value="jpeg">JPG</option>
              <option value="webp">WEBP</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm">
            Quality:
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              disabled={format === "png"}
              aria-label="Quality"
            />
          </label>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-sm text-gray-300">
            Max width (px)
            <input
              type="number"
              min="1"
              className="input mt-1"
              value={maxWidth}
              onChange={(e) => setMaxWidth(e.target.value)}
              placeholder="Leave empty to keep original"
            />
          </label>

          <label className="text-sm text-gray-300">
            Max height (px)
            <input
              type="number"
              min="1"
              className="input mt-1"
              value={maxHeight}
              onChange={(e) => setMaxHeight(e.target.value)}
              placeholder="Leave empty to keep original"
            />
          </label>
        </div>

        {error && <div role="alert" className="text-rose-400 text-sm mt-3">{error}</div>}

        <div className="flex gap-3 justify-center mt-4">
          <button onClick={convert} className="btn btn-primary" disabled={processing}>
            {processing ? "Converting…" : "Convert"}
          </button>
          <button onClick={clearAll} className="btn btn-secondary">Clear</button>
        </div>

        {convertedUrl && (
          <div className="mt-5 text-center">
            <div className="text-sm text-green-300 mb-2">Conversion ready ✅</div>
            <div className="flex gap-3 justify-center">
              <a href={convertedUrl} download={`converted.${format === "jpeg" ? "jpg" : format}`} className="btn btn-ghost">Download</a>
              <button onClick={download} className="btn btn-secondary">Save</button>
              <a href={convertedUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Open</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
