// src/app/tools/calculators/discount-calculator/DiscountCalculatorClient.jsx
"use client";

import { useState } from "react";

export default function DiscountCalculatorClient() {
  const [mode, setMode] = useState("apply"); // apply or reverse
  const [price, setPrice] = useState(""); // original price (apply) or original price (reverse)
  const [discount, setDiscount] = useState(""); // percent (apply) or computed (reverse)
  const [finalPrice, setFinalPrice] = useState(""); // final price (apply) or input (reverse)
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const presets = [5, 10, 15, 20, 25, 30, 50];

  function reset() {
    setPrice("");
    setDiscount("");
    setFinalPrice("");
    setResult(null);
    setError("");
  }

  function formatMoney(n) {
    return Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calculate() {
    setResult(null);
    setError("");

    if (mode === "apply") {
      const p = Number(price);
      const d = Number(discount);

      if (!isFinite(p) || p <= 0) return setError("Enter a valid original price.");
      if (!isFinite(d) || d < 0 || d > 100) return setError("Enter a discount between 0 and 100.");

      const savings = (p * d) / 100;
      const final = p - savings;
      setResult({
        mode: "apply",
        final: final.toFixed(2),
        savings: savings.toFixed(2),
        percent: d.toFixed(2),
        original: p.toFixed(2),
      });
      return;
    }

    // reverse mode: given original price and final price -> find discount %
    if (mode === "reverse") {
      const p = Number(price);
      const f = Number(finalPrice);
      if (!isFinite(p) || p <= 0) return setError("Enter a valid original price.");
      if (!isFinite(f) || f < 0 || f > p) return setError("Enter a valid final price (≤ original price).");

      const savings = p - f;
      const percent = (savings / p) * 100;
      setResult({
        mode: "reverse",
        original: p.toFixed(2),
        final: f.toFixed(2),
        savings: savings.toFixed(2),
        percent: percent.toFixed(2),
      });
      return;
    }
  }

  async function copyResult() {
    if (!result) return;
    try {
      const txt =
        result.mode === "apply"
          ? `Original $${result.original}, ${result.percent}% off → Final $${result.final} (You save $${result.savings})`
          : `Original $${result.original} → Final $${result.final}, discount ${result.percent}% (You save $${result.savings})`;
      await navigator.clipboard.writeText(txt);
      // small UI hint (can be improved)
      alert("Result copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl max-w-md mx-auto">
      <div className="flex gap-3 mb-4">
        <button
          className={`btn ${mode === "apply" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => {
            setMode("apply");
            reset();
          }}
        >
          Apply Discount
        </button>
        <button
          className={`btn ${mode === "reverse" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => {
            setMode("reverse");
            reset();
          }}
        >
          Reverse (find discount)
        </button>
      </div>

      <div className="space-y-3">
        {mode === "apply" && (
          <>
            <label className="block text-sm text-gray-300">Original Price (USD)</label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              className="input w-full"
              placeholder="e.g. 99.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <label className="block text-sm text-gray-300">Discount (%)</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                inputMode="decimal"
                min="0"
                max="100"
                step="0.01"
                className="input"
                placeholder="e.g. 25"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
              <div className="flex gap-2 ml-auto">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setDiscount(String(p))}
                    aria-label={`Set ${p}%`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {mode === "reverse" && (
          <>
            <label className="block text-sm text-gray-300">Original Price (USD)</label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              className="input w-full"
              placeholder="e.g. 100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <label className="block text-sm text-gray-300">Final Price (USD)</label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              className="input w-full"
              placeholder="e.g. 75"
              value={finalPrice}
              onChange={(e) => setFinalPrice(e.target.value)}
            />
          </>
        )}

        {error && <div role="alert" className="text-rose-400 text-sm">{error}</div>}

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

        {result && (
          <div className="mt-4 p-4 rounded bg-gray-900 border border-gray-700">
            <div className="text-sm text-gray-400">
              {result.mode === "apply" ? "After discount" : "Inferred discount"}
            </div>

            <div className="text-2xl font-semibold text-blue-300 mt-1">
              ${formatMoney(result.mode === "apply" ? result.final : result.final)}
            </div>

            <div className="mt-2 text-sm text-gray-300">
              Discount: <strong>{result.percent}%</strong> — You save: <strong>${result.savings}</strong>
            </div>

            <div className="text-xs text-gray-500 mt-2">Original price: ${result.original}</div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-400">
          Tip: use the preset buttons for common discounts (10%, 20%, 25%). For large shopping lists, multiply final price by quantity to get total.
        </div>
      </div>
    </div>
  );
}
