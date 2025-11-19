// src/app/tools/converters/pdf-to-word/PdfToWordClient.jsx
"use client";

import { useState } from "react";

export default function PdfToWordClient() {
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState("");
  const MAX_SIZE = 40 * 1024 * 1024; // 40 MB limit

  const convertPdf = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setDownloadUrl(null);
    setError("");

    if (file.size > MAX_SIZE) {
      setError("PDF too large. Please use a file under 40 MB.");
      return;
    }

    setLoading(true);

    try {
      // Load PDF.js + docx dynamically (browser only)
      const pdfjs = await import("pdfjs-dist/build/pdf");
      const { Document, Packer, Paragraph, TextRun } = await import("docx");

      // PDF.js worker fix
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.mjs",
        import.meta.url
      ).toString();

      const buffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buffer }).promise;

      const paragraphs = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // preserve readable line structure
        const text = textContent.items
          .map((i) => i.str)
          .join(" ")
          .replace(/\s{2,}/g, " ")
          .trim();

        paragraphs.push(new Paragraph({ children: [new TextRun(text)] }));
        paragraphs.push(new Paragraph("")); // page spacing
      }

      const doc = new Document({
        sections: [{ children: paragraphs }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      setError("Failed to convert PDF. Try another file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/40 p-6 rounded-xl text-center">
      <input
        type="file"
        accept="application/pdf"
        onChange={convertPdf}
        className="border p-2 rounded-lg cursor-pointer bg-gray-900 border-gray-700 text-gray-200"
      />

      {loading && (
        <p className="text-gray-400 mt-3 animate-pulse">
          Converting PDF… Please wait
        </p>
      )}

      {error && <p className="text-red-400 mt-3">{error}</p>}

      {downloadUrl && (
        <a
          href={downloadUrl}
          download="converted.docx"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow transition"
        >
          Download Word File
        </a>
      )}
    </div>
  );
}
