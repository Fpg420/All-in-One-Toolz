// src/app/tools/converters/pdf-to-word/page.js
export const metadata = {
  title: "PDF to Word Converter — Free Online | All-in-One Toolz",
  description:
    "Convert PDF files to editable Word (.docx) documents directly in your browser. Fast, private, and 100% client-side — no uploads required.",
};

import PdfToWordClient from "./PdfToWordClient";

export default function PdfToWordPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-4">
          PDF to Word Converter
        </h1>

        <p className="text-gray-300 mb-6">
          Convert any PDF into an editable Microsoft Word document (.docx)
          directly in your browser. Your files never leave your device —
          conversion is 100% local and private.
        </p>

        <PdfToWordClient />

        <section className="mt-10 text-gray-400 text-sm leading-relaxed">
          <h2 className="text-xl text-gray-200 font-semibold mb-2">
            Important Notes
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Best for text-based PDFs (scanned PDFs become empty text).</li>
            <li>Large PDFs may take longer due to in-browser processing.</li>
            <li>Your files are never uploaded — they stay on your device.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
