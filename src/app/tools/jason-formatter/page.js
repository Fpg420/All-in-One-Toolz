"use client";

import { useState } from "react";
import { js_beautify } from "js-beautify";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = js_beautify(JSON.stringify(parsed, null, 2));
      setOutput(formatted);
    } catch (err) {
      setOutput("Invalid JSON! Please check your input.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">JSON Formatter</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste JSON here..."
        className="w-full p-2 border rounded mb-4 h-40"
      />

      <button
        onClick={handleFormat}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Format JSON
      </button>

      <textarea
        value={output}
        readOnly
        placeholder="Formatted JSON will appear here..."
        className="w-full p-2 border rounded mt-4 h-40 bg-gray-50"
      />
    </div>
  );
}

