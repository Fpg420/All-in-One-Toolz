"use client";
import React, { useState } from "react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [text, setText] = useState("");
  const [matches, setMatches] = useState([]);

  const testRegex = () => {
    try {
      const regex = new RegExp(pattern, "g");
      const result = [...text.matchAll(regex)].map((m) => m[0]);
      setMatches(result.length ? result : ["No matches found"]);
    } catch {
      setMatches(["⚠️ Invalid Regular Expression"]);
    }
  };

  return (
    <div className="p-6 text-center text-white">
      <h1 className="text-3xl font-bold mb-4">🧠 Regex Tester</h1>
      <input
        className="w-full text-black p-2 rounded mb-3"
        placeholder="Enter regex pattern (e.g. \\d+)"
        value={pattern}
        onChange={(e) => setPattern(e.target.value)}
      />
      <textarea
        className="w-full text-black p-3 rounded"
        rows="5"
        placeholder="Enter test text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={testRegex}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 mt-4 rounded"
      >
        Test Regex
      </button>
      <pre className="bg-gray-900 text-left mt-4 p-4 rounded overflow-auto">
        {matches.join("\n")}
      </pre>
    </div>
  );
}
