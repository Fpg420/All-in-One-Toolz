"use client";
import { useState } from "react";
import Link from "next/link"; // ✅ added this line

export default function Calculator() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("simple"); // simple or scientific

  const handleClick = (value) => setInput(input + value);
  const handleClear = () => setInput("");
  const handleBackspace = () => setInput(input.slice(0, -1));

  const handleCalculate = () => {
    try {
      // eslint-disable-next-line no-eval
      setInput(eval(input).toString());
    } catch {
      setInput("Error");
    }
  };

  const handleScientific = (func) => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(func.replace("x", input));
      setInput(result.toString());
    } catch {
      setInput("Error");
    }
  };

  const simpleButtons = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "+"];

  const scientificButtons = [
    { label: "sin", func: "Math.sin(x)" },
    { label: "cos", func: "Math.cos(x)" },
    { label: "tan", func: "Math.tan(x)" },
    { label: "√", func: "Math.sqrt(x)" },
    { label: "x²", func: "x**2" },
    { label: "log", func: "Math.log10(x)" },
  ];

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">🧮 Calculator</h1>

      {/* ✅ Added Back to Home link here */}
      <Link href="/" className="text-blue-400 hover:underline mb-4">
        ← Back to Home
      </Link>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode("simple")}
          className={`px-4 py-2 rounded ${mode === "simple" ? "bg-blue-600" : "bg-gray-700"}`}
        >
          Simple
        </button>
        <button
          onClick={() => setMode("scientific")}
          className={`px-4 py-2 rounded ${mode === "scientific" ? "bg-blue-600" : "bg-gray-700"}`}
        >
          Scientific
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-xl w-80 text-center shadow-md">
        <div className="bg-black text-right text-2xl p-2 rounded mb-4 h-12">{input || "0"}</div>

        {mode === "simple" && (
          <div className="grid grid-cols-4 gap-2">
            {simpleButtons.map((btn) => (
              <button
                key={btn}
                onClick={() => handleClick(btn)}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-lg"
              >
                {btn}
              </button>
            ))}
            <button onClick={handleBackspace} className="bg-yellow-600 hover:bg-yellow-500 p-3 rounded-lg">
              ⌫
            </button>
            <button onClick={handleClear} className="bg-red-600 hover:bg-red-500 p-3 rounded-lg">
              C
            </button>
            <button onClick={handleCalculate} className="bg-green-600 hover:bg-green-500 p-3 rounded-lg col-span-2">
              =
            </button>
          </div>
        )}

        {mode === "scientific" && (
          <div className="grid grid-cols-3 gap-2">
            {scientificButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={() => handleScientific(btn.func)}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-lg"
              >
                {btn.label}
              </button>
            ))}
            <button onClick={handleBackspace} className="bg-yellow-600 hover:bg-yellow-500 p-3 rounded-lg">
              ⌫
            </button>
            <button onClick={handleClear} className="bg-red-600 hover:bg-red-500 p-3 rounded-lg">
              C
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
