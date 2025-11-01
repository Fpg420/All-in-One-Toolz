"use client";
import { useState } from "react";
import Link from "next/link";

export default function FileConverter() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState("png");
  const [convertedUrl, setConvertedUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setConvertedUrl("");
  };

  const handleConvert = async () => {
    if (!file) return alert("Please select a file first!");

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];

      if (file.type.startsWith("image/")) {
        convertImage(base64);
      } else if (file.type === "application/pdf") {
        alert("PDF conversion not supported yet in-browser.");
      } else {
        alert("Unsupported file type.");
      }
    };
    reader.readAsDataURL(file);
  };

  const convertImage = (base64) => {
    const img = new Image();
    img.src = `data:${file.type};base64,${base64}`;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const newDataUrl = canvas.toDataURL(`image/${format}`);
      setConvertedUrl(newDataUrl);
    };
  };

  const downloadConverted = () => {
    const a = document.createElement("a");
    a.href = convertedUrl;
    a.download = `converted.${format}`;
    a.click();
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">🔄 File Converter</h1>

      <Link href="/" className="text-blue-400 hover:underline mb-6">
        ← Back to Home
      </Link>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md text-center">
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4 w-full"
        />

        <div className="mb-4">
          <label className="mr-2">Convert to:</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="text-black p-2 rounded"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPG</option>
            <option value="webp">WEBP</option>
          </select>
        </div>

        <button
          onClick={handleConvert}
          className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg font-semibold"
        >
          Convert
        </button>

        {convertedUrl && (
          <div className="mt-6">
            <img
              src={convertedUrl}
              alt="Converted Preview"
              className="rounded-lg mb-3 w-full"
            />
            <button
              onClick={downloadConverted}
              className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg"
            >
              Download Converted File
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
