// src/app/tools/calculators/simple-interest-calculator/InterestCalculatorClient.jsx
"use client";

import { useState } from "react";

const FREQUENCIES = [
  { label: "Yearly", value: 1 },
  { label: "Semi-Annually", value: 2 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
  { label: "Daily (365)", value: 365 },
];

function formatMoney(n) {
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function InterestCalculatorClient() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState(""); // annual percentage e.g. 5 for 5%
  const [time, setTime] = useState(""); // years (can be fractional)
  const [compound, setCompound] = useState(false);
  const [frequency, setFrequency] = useState(12);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function reset() {
    setPrincipal("");
    setRate("");
    setTime("");
    setCompound(false);
    setFrequency(12);
    setResult(null);
    setError("");
  }

  function calculate() {
    setError("");
    setResult(null);

    const P = Number(principal);
    const R = Number(rate);
    const T = Number(time);

    if (!isFinite(P) || P <= 0) return setError("Enter a valid principal (> 0).");
    if (!isFinite(R) || R < 0) return setError("Enter a valid annual rate (≥ 0).");
    if (!isFinite(T) || T <= 0) return setError("Enter a valid time in years (> 0).");

    if (!compound) {
      // simple interest
      const interest = (P * R * T) / 100;
      const total = P + interest;
      setResult({
        type: "simple",
        principal: P,
        interest,
        total,
      });
      return;
    }

    // compound interest
    const n = Number(frequency) || 1;
    const r = R / 100;
    // A = P * (1 + r/n)^(n * t)
    const total = P * Math.pow(1 + r / n, n * T);
    const interest = total - P;
    setResult({
      type: "compound",
      principal: P,
      interest,
      total,
      frequency: n,
    });
  }

  async function copyResult() {
    if (!result) return;
    const txt =
      result.type === "simple"
        ? `Simple interest: principal $${formatMoney(result.principal)}, interest $${formatMoney(result.interest)}, total $${formatMoney(result.total)}`
        : `Compound interest (${result.frequency}x/yr): principal $${formatMoney(result.principal)}, interest $${formatMoney(result.interest)}, total $${formatMoney(result.total)}`;
    try {
      await navigator.clipboard.writeText(txt);
      // small unobtrusive UI hint
      alert("Result copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  }

  return (
    <div className="bg-gray-800/40 p-6 rounded-xl max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <label htmlFor="principal" className="block text-sm text-gray-300 mb-1">
            Principal (initial amount)
          </label>
          <input
            id="principal"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="input w-full"
            placeholder="e.g. 1000"
            aria-label="Principal"
          />
        </div>

        <div>
          <label htmlFor="rate" className="block text-sm text-gray-300 mb-1">
            Annual rate (%) — e.g. 5 for 5%
          </label>
          <input
            id="rate"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="input w-full"
            placeholder="e.g. 5"
            aria-label="Annual rate"
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm text-gray-300 mb-1">
            Time (years)
          </label>
          <input
            id="time"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="input w-full"
            placeholder="e.g. 3 or 2.5"
            aria-label="Time in years"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={compound}
              onChange={(e) => setCompound(e.target.checked)}
              aria-label="Compound interest toggle"
            />
            Compound interest
          </label>

          {compound && (
            <div className="ml-auto flex items-center gap-2">
              <label className="text-sm text-gray-300">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="input"
                aria-label="Compounding frequency"
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

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
              {result.type === "simple" ? "Simple interest" : `Compound interest (${result.frequency}×/yr)`}
            </div>

            <div className="text-2xl font-semibold text-blue-300 mt-1">
              Interest: ${formatMoney(result.interest)}
            </div>

            <div className="mt-2 text-sm text-gray-300">
              Total amount: <strong>${formatMoney(result.total)}</strong>
            </div>

            <div className="text-xs text-gray-500 mt-2">Principal: ${formatMoney(result.principal)}</div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-400">
          Tip: for fractional years (e.g., 1.5 years), enter decimals. Compound interest frequency affects final total — monthly compounding yields slightly more than yearly.
        </div>
      </div>
    </div>
  );
}
