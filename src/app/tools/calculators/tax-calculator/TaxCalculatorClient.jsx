// src/app/tools/calculators/tax-calculator/TaxCalculatorClient.jsx
"use client";

import { useState } from "react";

function formatMoney(n) {
  return Number(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function TaxCalculatorClient() {
  const [income, setIncome] = useState("");
  const [flatRate, setFlatRate] = useState("");
  const [mode, setMode] = useState("flat"); // flat | slabs
  const [slabs, setSlabs] = useState([
    { upto: "", rate: "" },
  ]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const reset = () => {
    setIncome("");
    setFlatRate("");
    setSlabs([{ upto: "", rate: "" }]);
    setResult(null);
    setError("");
  };

  const addSlab = () => {
    setSlabs([...slabs, { upto: "", rate: "" }]);
  };

  const removeSlab = (index) => {
    setSlabs(slabs.filter((_, i) => i !== index));
  };

  const calculateFlat = (income, rate) => {
    const tax = (income * rate) / 100;
    return {
      tax,
      effectiveRate: (tax / income) * 100,
      breakdown: [{ on: income, rate, tax }],
    };
  };

  const calculateSlabs = (income) => {
    let remaining = income;
    let totalTax = 0;
    const breakdown = [];

    for (const slab of slabs) {
      const limit = Number(slab.upto);
      const rate = Number(slab.rate);

      if (!limit || !rate) continue;

      const taxable = Math.min(remaining, limit);
      const tax = (taxable * rate) / 100;
      totalTax += tax;
      remaining -= taxable;

      breakdown.push({ on: taxable, rate, tax });

      if (remaining <= 0) break;
    }

    // Leftover income (if slabs don't cover full income)
    if (remaining > 0) {
      breakdown.push({ on: remaining, rate: 0, tax: 0 });
    }

    return {
      tax: totalTax,
      effectiveRate: (totalTax / income) * 100,
      breakdown,
    };
  };

  const calculate = () => {
    setError("");
    setResult(null);

    const inc = Number(income);
    if (inc <= 0) return setError("Enter a valid income.");

    if (mode === "flat") {
      const rate = Number(flatRate);
      if (rate <= 0) return setError("Enter a valid flat tax rate.");
      setResult(calculateFlat(inc, rate));
    } else {
      // slabs mode
      const validSlabs = slabs.some(s => s.upto && s.rate);
      if (!validSlabs) return setError("Add at least one valid tax slab.");

      setResult(calculateSlabs(inc));
    }
  };

  const copyResult = async () => {
    if (!result) return;
    const txt = `Total tax: ${formatMoney(result.tax)}, Effective rate: ${result.effectiveRate.toFixed(
      2
    )}%`;
    await navigator.clipboard.writeText(txt);
    alert("Copied!");
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl max-w-md mx-auto">

      {/* Mode Toggle */}
      <div className="flex gap-3 mb-5">
        <button
          className={`btn ${mode === "flat" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setMode("flat")}
        >
          Flat Tax
        </button>

        <button
          className={`btn ${mode === "slabs" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setMode("slabs")}
        >
          Tax Slabs
        </button>
      </div>

      {/* Income */}
      <input
        type="number"
        placeholder="Annual Income"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        className="input w-full mb-3"
      />

      {/* Flat Mode */}
      {mode === "flat" && (
        <input
          type="number"
          placeholder="Tax Rate (%)"
          value={flatRate}
          onChange={(e) => setFlatRate(e.target.value)}
          className="input w-full mb-3"
        />
      )}

      {/* Slab Mode */}
      {mode === "slabs" && (
        <div className="space-y-3">
          {slabs.map((slab, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="number"
                placeholder="Upto (amount)"
                value={slab.upto}
                onChange={(e) => {
                  const newSlabs = [...slabs];
                  newSlabs[i].upto = e.target.value;
                  setSlabs(newSlabs);
                }}
                className="input w-1/2"
              />
              <input
                type="number"
                placeholder="Rate (%)"
                value={slab.rate}
                onChange={(e) => {
                  const newSlabs = [...slabs];
                  newSlabs[i].rate = e.target.value;
                  setSlabs(newSlabs);
                }}
                className="input w-1/2"
              />

              {slabs.length > 1 && (
                <button
                  onClick={() => removeSlab(i)}
                  className="btn btn-ghost text-red-400"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button onClick={addSlab} className="btn btn-secondary w-full">
            + Add Slab
          </button>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button onClick={calculate} className="btn btn-primary w-full">
          Calculate
        </button>
        <button onClick={reset} className="btn btn-secondary w-full">
          Reset
        </button>
        {result && (
          <button onClick={copyResult} className="btn btn-ghost">
            Copy
          </button>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 mt-5">
          <p className="text-gray-400 text-sm">Total Tax</p>
          <p className="text-xl font-bold text-blue-400">
            {formatMoney(result.tax)}
          </p>

          <p className="text-gray-400 text-sm mt-3">Effective Tax Rate</p>
          <p className="text-lg font-semibold text-green-400">
            {result.effectiveRate.toFixed(2)}%
          </p>

          <h3 className="text-sm font-semibold text-gray-300 mt-4">
            Breakdown
          </h3>

          <ul className="text-sm mt-2 space-y-1">
            {result.breakdown.map((b, i) => (
              <li key={i} className="text-gray-400">
                ₹{formatMoney(b.on)} × {b.rate}% →  
                <span className="text-blue-300"> {formatMoney(b.tax)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
