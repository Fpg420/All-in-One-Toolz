"use client";

import { useState } from "react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

function getBmiCategory(bmi) {
  const n = Number(bmi);
  if (!n || isNaN(n)) return "";
  if (n < 18.5) return "Underweight";
  if (n < 25) return "Normal weight";
  if (n < 30) return "Overweight";
  return "Obesity";
}

export default function BMICalculator() {
  const [unit, setUnit] = useState("metric");

  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");

  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [weightLbs, setWeightLbs] = useState("");

  const [bmi, setBmi] = useState(null);
  const [error, setError] = useState("");

  function clearAll() {
    setBmi(null);
    setError("");
    setHeightCm("");
    setWeightKg("");
    setHeightFeet("");
    setHeightInches("");
    setWeightLbs("");
  }

  function calculateBMI() {
    setError("");
    let hMeters;
    let wKg;

    if (unit === "metric") {
      if (!heightCm || !weightKg) {
        setError("Please enter height (cm) and weight (kg).");
        return;
      }

      const h = parseFloat(heightCm);
      const w = parseFloat(weightKg);

      if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
        setError("Please enter valid positive numbers.");
        return;
      }

      hMeters = h / 100;
      wKg = w;
    } else {
      if (!heightFeet && !heightInches) {
        setError("Enter height in ft/in.");
        return;
      }
      if (!weightLbs) {
        setError("Enter weight in lbs.");
        return;
      }

      const ft = parseFloat(heightFeet || "0");
      const inc = parseFloat(heightInches || "0");
      const w = parseFloat(weightLbs);

      if (isNaN(ft) || isNaN(inc) || isNaN(w) || ft < 0 || inc < 0 || w <= 0) {
        setError("Enter valid numbers.");
        return;
      }

      const totalInches = ft * 12 + inc;
      const cm = totalInches * 2.54;
      hMeters = cm / 100;
      wKg = w * 0.45359237;
    }

    if (hMeters <= 0) {
      setError("Height must be greater than zero.");
      return;
    }

    const result = wKg / (hMeters * hMeters);
    if (!isFinite(result)) {
      setError("Could not calculate BMI.");
      return;
    }

    setBmi(result.toFixed(2));
  }

  async function copyResult() {
    if (!bmi) return;
    try {
      await navigator.clipboard.writeText(String(bmi));
    } catch {}
  }

  return (
    <ToolPageTemplate
      title="BMI Calculator"
      description="Estimate your Body Mass Index instantly using height and weight."
    >
      <section className="max-w-3xl mx-auto mb-6 text-gray-200">
        <h2 className="text-2xl font-semibold mb-2">What is BMI?</h2>
        <p className="mb-2">
          The Body Mass Index (BMI) calculator helps determine if your weight is healthy
          for your height. It is a simple, widely used health indicator.
        </p>
        <p className="text-sm text-gray-400">
          Enter height and weight below in either metric or imperial units.
        </p>
      </section>

      <div className="bg-gray-800/40 p-6 rounded-xl max-w-xl mx-auto">
        <div className="flex gap-3 items-center mb-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="unit"
              checked={unit === "metric"}
              onChange={() => {
                setUnit("metric");
                setBmi(null);
                setError("");
              }}
            />
            Metric (cm/kg)
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="unit"
              checked={unit === "imperial"}
              onChange={() => {
                setUnit("imperial");
                setBmi(null);
                setError("");
              }}
            />
            Imperial (ft/in/lb)
          </label>
        </div>

        {/* METRIC */}
        {unit === "metric" && (
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Height (cm)"
              className="input w-full"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              className="input w-full"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
            />
          </div>
        )}

        {/* IMPERIAL */}
        {unit === "imperial" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Feet"
                className="input w-full"
                value={heightFeet}
                onChange={(e) => setHeightFeet(e.target.value)}
              />
              <input
                type="number"
                placeholder="Inches"
                className="input w-full"
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
              />
            </div>
            <input
              type="number"
              placeholder="Weight (lbs)"
              className="input w-full"
              value={weightLbs}
              onChange={(e) => setWeightLbs(e.target.value)}
            />
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button onClick={calculateBMI} className="btn btn-primary">
            Calculate BMI
          </button>
          <button onClick={clearAll} className="btn btn-secondary">
            Clear
          </button>
          <button onClick={copyResult} className="btn btn-ghost" disabled={!bmi}>
            Copy
          </button>
        </div>

        {error && <div className="mt-4 text-sm text-rose-400">{error}</div>}

        {bmi && (
          <div className="mt-6 p-4 rounded-lg bg-gray-900 border border-gray-700">
            <div className="text-sm text-gray-400">Your BMI</div>
            <div className="text-3xl font-semibold text-blue-300">{bmi}</div>
            <div className="mt-2">
              <span className="font-medium mr-2">{getBmiCategory(bmi)}</span>
            </div>
          </div>
        )}
      </div>

      <section className="max-w-3xl mx-auto mt-8 text-gray-400 text-sm">
        <h3 className="text-lg font-semibold mb-2">Notes</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>BMI is a general health indicator, not a diagnosis.</li>
          <li>It may not apply accurately to athletes or very muscular individuals.</li>
          <li>Consult a health professional for personalized guidance.</li>
        </ul>
      </section>
    </ToolPageTemplate>
  );
}
