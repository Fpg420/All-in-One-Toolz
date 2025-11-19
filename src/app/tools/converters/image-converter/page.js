// src/app/tools/converters/image-converter/page.js
export const metadata = {
  title: "Image Converter — PNG / JPG / WebP (Client-side)",
  description:
    "Convert images between PNG, JPG and WebP directly in your browser. Resize, choose quality, preview and download — private and fast (no uploads).",
};

import ImageConverterClient from "./ImageConverterClient";

export default function ImageConverterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-blue-400">Image Converter</h1>

        <p className="text-gray-300 mb-6">
          Convert images between PNG, JPG and WebP right in your browser. Choose output format,
          adjust quality (for JPG/WebP), resize dimensions, preview the result, then download.
          Nothing is uploaded — all processing happens locally for privacy.
        </p>

        <ImageConverterClient />

        <section className="mt-8 text-gray-400">
          <h2 className="text-xl font-semibold mb-2">Why use this tool?</h2>
          <ul className="list-disc ml-6">
            <li>Fast client-side conversion — no uploads</li>
            <li>Resize images while keeping aspect ratio</li>
            <li>Control quality for smaller files (JPG / WebP)</li>
            <li>Preview and download the converted file</li>
          </ul>

          <p className="mt-4 text-sm">
            Handy for optimizing images for web, converting screenshots, or creating WebP versions for faster sites.
            If you need batch conversion or server-side processing, consider a separate workflow.
          </p>
        </section>
      </div>
    </main>
  );
}
