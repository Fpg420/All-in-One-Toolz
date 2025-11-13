"use client";

import { useState } from "react";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import * as pdfjsLib from "pdfjs-dist";
import { Document, Packer, Paragraph, TextRun } from "docx";

// Set workerSrc via CDN (best for Next.js + Vercel builds)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfToWordConverter() {
  const [loading, setLoading] = useState(false);
  const [outputUrl, setOutputUrl] = useState(null);
  const [error, setError] = useState("");

  const handleConvert = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setOutputUrl(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const paragraphs = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");

        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: pageText })],
            spacing: { after: 200 },
          })
        );
      }

      const doc = new Document({ sections: [{ children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
    } catch (err) {
      console.error(err);
      setError("Conversion failed. This PDF may be image-based or corrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageTemplate
      title="PDF to Word Converter"
      description="Convert your PDF documents into editable Word (DOCX) files directly in your browser."
    >
      <div className="space-y-6 text-center">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleConvert}
          className="border p-2 rounded-lg cursor-pointer"
        />

        {loading && <p className="text-gray-400">Converting... Please wait.</p>}
        {error && <p className="text-red-500">{error}</p>}

        {outputUrl && (
          <div className="mt-4">
            <a
              href={outputUrl}
              download="converted.docx"
              className="px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-600 transition"
            >
              Download Word File
            </a>
          </div>
        )}
      </div>
    </ToolPageTemplate>
  );
}
