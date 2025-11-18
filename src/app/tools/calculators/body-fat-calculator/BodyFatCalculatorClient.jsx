// src/app/tools/calculators/body-fat-calculator/BodyFatCalculatorClient.jsx
"use client";

import { useState, useEffect } from "react";

/**
 * Quick estimate formula (keeps your original formula for compatibility)
 * Original: ((waist * 1.082 + 94.42 - weight * 4.15) / weight) * 100
 * Assumes waist in inches and weight in lbs.
 */
function quickEstimateBodyFat(waistInches, weightLbs) {
  const bf = ((waistInches * 1.082 + 94.42 - weightLbs * 4.15) / weightLbs) * 100;
  return bf;
}

/**
 * U.S. Navy body fat formulas (approx.)
 * - Men: % body fat = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
 * - Women: % body fat = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
 * Inputs in cm.
 */
function navyBodyFat({ sex, heightCm, neckCm, waistCm, hipCm }) {
  const h = Number(heightCm);
  const n = Number(neckCm);
  const w = Number(waistCm);
  const hip = hipCm ? Number(hipCm) : 0;

  if (sex === "male") {
    const value = 86.010 * Math.log10(Math.max(1, w - n)) - 70.041 * Math.log10(Math.max(1, h)) + 36.76;
    return value;
  } else {
    const value = 163.205 * Math.log10(Math.max(1, w + hip - n)) - 97.684 * Math.log10(Math.max(1, h)) - 78.387;
    return value;
  }
}

function classifyBodyFat(sex, bf) {
  const n = Number(bf);
  if (isNaN(n)) return "";
  if (sex === "male") {
    if (n < 6) return "Essential fat";
    if (n < 14) return "Athletes";
    if (n < 18) return "Fitness";
    if (n < 25) return "Average";
    return "Obese";
  } else {
    if (n < 14) return "Essential fat";
    if (n < 21) return "Athletes";
    if (n < 25) return "Fitness";
    if (n < 32) return "Average";
    return "Obese";
  }
}

export default function BodyFatCalculatorClient() {
  const [method, setMethod] = useState("quick"); // quick or navy
  const [units, setUnits] = useState("imperial"); // imperial or metric

  // Quick (imperial inputs)
  const [waist, setWaist] = useState(""); // inches or cm depending
  const [weight, setWeight] = useState("");

  // Navy (prefer metric for formulas)
  const [sex, setSex] = useState("male");
  const [height, setHeight] = useState(""); // cm or inches
  const [neck, setNeck] = useState("");
  const [hip, setHip] = useState(""); // only for female
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 1500);
      return () => clearTimeout(t);
    }
  }, [copied]);

  function toCm(value, fromUnits) {
    const v = Number(value);
    if (isNaN(v)) return NaN;
    if (fromUnits === "cm") return v;
    // from inches to cm
    return v * 2.54;
  }

  function toLbs(value, fromUnits) {
    const v = Number(value);
    if (isNaN(v)) return NaN;
    if (fromUnits === "lbs") return v;
    // kg to lbs
    return v * 2.2046226218;
  }

  function calculate() {
    setError("");
    setResult(null);

    try {
      if (method === "quick") {
        // quick estimate expects waist (inches) and weight (lbs)
        let waistIn = waist;
        let weightL = weight;

        if (units === "metric") {
          // waist in cm -> inches, weight kg -> lbs
          waistIn = Number(waist) / 2.54;
          weightL = Number(weight) * 2.2046226218;
        } else {
          waistIn = Number(waist);
          weightL = Number(weight);
        }

        if (!waistIn || !weightL || waistIn <= 0 || weightL <= 0) {
          setError("Please enter valid waist and weight values.");
          return;
        }

        const bf = quickEstimateBodyFat(waistIn, weightL);
        setResult({ method: "Quick estimate", value: Number(bf.toFixed(2)) });
        return;
      }

      // Navy method
      const hCm = units === "metric" ? Number(height) : toCm(height, "in");
      const neckCm = units === "metric" ? Number(neck) : toCm(neck, "in");
      const waistCm = units === "metric" ? Number(waist) : toCm(waist, "in");
      const hipCm = units === "metric" ? Number(hip) : toCm(hip, "in");

      if (!hCm || !neckCm || !waistCm || hCm <= 0 || neckCm <= 0 || waistCm <= 0) {
        setError("Please enter valid positive numbers for height, neck and waist.");
        return;
      }
      if (sex === "female" && (!hipCm || hipCm <= 0)) {
        setError("Please enter hip circumference for female (Navy method).");
        return;
      }

      const bf = navyBodyFat({
        sex,
        heightCm: hCm,
        neckCm,
        waistCm,
        hipCm: sex === "female" ? hipCm : 0,
      });
      setResult({ method: "U.S. Navy", value: Number(bf.toFixed(2)) });
    } catch (e) {
      console.error(e);
      setError("Calculation failed. Check your inputs.");
    }
  }

  async function copyResult() {
    if (!result) return;
    try {
      const text = `${result.method} body fat: ${result.value}% (${classifyBodyFat(sex, result.value)})`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function clearAll() {
    setResult(null);
    setError("");
    setWaist("");
    setWeight("");
    setHeight("");
    setNeck("");
    setHip("");
  }

  return (
    <div className="bg-gray-800/40 p-6 rounded-xl">
      <div className="space-y-4">
        <div className="flex gap-4 flex-wrap items-center">
          <label className="text-sm">
            <input
              type="radio"
              name="method"
              value="quick"
              checked={method === "quick"}
              onChange={() => {
                setMethod("quick");
                setResult(null);
                setError("");
              }}
            />{" "}
            Quick estimate
          </label>
          <label className="text-sm">
            <input
              type="radio"
              name="method"
              value="navy"
              checked={method === "navy"}
              onChange={() => {
                setMethod("navy");
                setResult(null);
                setError("");
              }}
            />{" "}
            U.S. Navy method
          </label>

          <div className="ml-auto flex gap-2 items-center">
            <label className="text-sm">Units:</label>
            <select
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="bg-gray-700 text-gray-100 p-1 rounded"
              aria-label="Units"
            >
              <option value="imperial">Imperial (in, lbs)</option>
              <option value="metric">Metric (cm, kg)</option>
            </select>
          </div>
        </div>

        {/* form */}
        {method === "quick" ? (
          <div className="space-y-3">
            <div>
              <label htmlFor="waist" className="block text-sm text-gray-300">Waist ({units === "metric" ? "cm" : "inches"})</label>
              <input
                id="waist"
                type="number"
                min="0"
                step="0.1"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="input w-full"
                aria-label="Waist measurement"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm text-gray-300">Weight ({units === "metric" ? "kg" : "lbs"})</label>
              <input
                id="weight"
                type="number"
                min="0"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input w-full"
                aria-label="Weight"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label htmlFor="height" className="block text-sm text-gray-300">Height ({units === "metric" ? "cm" : "inches"})</label>
              <input
                id="height"
                type="number"
                min="0"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="input w-full"
                aria-label="Height"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="neck" className="block text-sm text-gray-300">Neck ({units === "metric" ? "cm" : "inches"})</label>
                <input
                  id="neck"
                  type="number"
                  min="0"
                  step="0.1"
                  value={neck}
                  onChange={(e) => setNeck(e.target.value)}
                  className="input w-full"
                  aria-label="Neck circumference"
                />
              </div>

              <div>
                <label htmlFor="waistNav" className="block text-sm text-gray-300">Waist ({units === "metric" ? "cm" : "inches"})</label>
                <input
                  id="waistNav"
                  type="number"
                  min="0"
                  step="0.1"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  className="input w-full"
                  aria-label="Waist circumference for Navy method"
                />
              </div>
            </div>

            <div>
              <label htmlFor="hip" className="block text-sm text-gray-300">Hip ({units === "metric" ? "cm" : "inches"}) <span className="text-xs text-gray-400">(required for women)</span></label>
              <input
                id="hip"
                type="number"
                min="0"
                step="0.1"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                className="input w-full"
                aria-label="Hip circumference"
              />
            </div>

            <div className="flex gap-2 items-center">
              <label className="text-sm">Sex:</label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="sex" value="male" checked={sex === "male"} onChange={() => setSex("male")} /> Male
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="sex" value="female" checked={sex === "female"} onChange={() => setSex("female")} /> Female
              </label>
            </div>
          </div>
        )}

        {/* actions */}
        <div className="flex gap-3 mt-4">
          <button onClick={calculate} className="btn btn-primary">Calculate</button>
          <button onClick={clearAll} className="btn btn-secondary">Clear</button>
          <button onClick={copyResult} className="btn btn-ghost" disabled={!result}>{copied ? "Copied!" : "Copy"}</button>
        </div>

        {/* error */}
        {error && <div role="alert" className="mt-4 text-sm text-rose-400">{error}</div>}

        {/* result */}
        {result && (
          <div className="mt-4 p-4 rounded bg-gray-900 border border-gray-700">
            <div className="text-sm text-gray-400">Method: <strong>{result.method}</strong></div>
            <div className="text-2xl font-semibold text-blue-300">{result.value}%</div>
            <div className="mt-2 text-sm text-gray-300">Category: <strong>{classifyBodyFat(sex, result.value)}</strong></div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-400">
          <strong>Disclaimer:</strong> Results are estimates. For precise measurements, consult a professional.
        </div>
      </div>
    </div>
  );
}
