// src/app/tools/calculators/percentage-calculator/PercentageCalculatorClient.jsx
"use client";

import { useState } from "react";

export default function PercentageCalculatorClient() {
  const [mode, setMode] = useState("percentOf"); // percentOf, valueFromPercent
  const [value, setValue] = useState("");
  const [total, setTotal] = useState("");
  const [percent, setPercent] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const reset = () => {
    setValue("");
    setTotal("");
    setPercent("");
    setResult(null);
    setError("");
  };

  const calculate = () => {
    setResult(null);
    setError("");

    if (mode === "percentOf") {
      if (!value || !total) return setError("Enter both value and total.");
      const r = ((value / total) * 100).toFixed(2);
      setResult(`${r}%`);
    }

    if (mode === "valueFromPercent") {
      if (!percent || !total) return setError("Enter both percent and total.");
      const r = ((percent / 100) * total).toFixed(2);
      setResult(r);
    }
  };

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.toString());
      alert("Copied!");
    } catch {
      alert("Copy failed");
    }
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl max-w-md mx-auto">
      {/* Mode */}
      <div className="flex gap-3 mb-5">
        <button
          className={`btn ${mode === "percentOf" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => {
            setMode("percentOf");
            reset();
          }}
        >
          Value → Percent
        </button>

        <button
          className={`btn ${mode === "valueFromPercent" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => {
            setMode("valueFromPercent");
            reset();
          }}
        >
          Percent → Value
        </button>
      </div>

      {/* Inputs */}
      {mode === "percentOf" && (
        <>
          <input
            type="number"
            placeholder="Value"
            className="input mb-3"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <input
            type="number"
            placeholder="Total"
            className="input mb-3"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
          />
        </>
      )}

      {mode === "valueFromPercent" && (
        <>
          <input
            type="number"
            placeholder="Percent (%)"
            className="input mb-3"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
          />
          <input
            type="number"
            placeholder="Total"
            className="input mb-3"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
          />
        </>
      )}

      {/* Error */}
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={calculate} className="btn btn-primary">
          Calculate
        </button>
        <button onClick={reset} className="btn btn-secondary">
          Reset
        </button>
        {result && (
          <button onClick={copyResult} className="btn btn-ghost">
            Copy
          </button>
        )}
      </div>

      {/* Result */}
      {result && (
        <p className="mt-4 text-lg font-semibold text-blue-300">
          Result: {result}
        </p>
      )}
    </div>
  );
}
