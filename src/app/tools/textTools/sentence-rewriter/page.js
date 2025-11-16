"use client";
import { useState } from "react";

export default function SentenceRewriter() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");

  const rewrite = () => {
    if (!text.trim()) return setOutput("❌ Please enter a sentence first.");
    // Mock rewrite – AI-ready for later integration
    setOutput(text.replace(/\b(\w+)\b/g, (w) => (Math.random() > 0.8 ? w.toUpperCase() : w)));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">✍️ Sentence Rewriter</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="8"
        placeholder="Enter your sentence or paragraph..."
        className="w-full max-w-xl p-4 bg-gray-800 border border-gray-700 rounded-lg mb-4"
      ></textarea>
      <button onClick={rewrite} className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg mb-4">
        Rewrite Text
      </button>
      {output && (
        <textarea
          readOnly
          rows="8"
          value={output}
          className="w-full max-w-xl p-4 bg-gray-800 border border-gray-700 rounded-lg"
        ></textarea>
      )}
    </main>
  );
}
