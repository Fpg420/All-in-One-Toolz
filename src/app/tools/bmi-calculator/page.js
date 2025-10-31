// src/app/tools/bmi-calculator/page.js
"use client";
import { useState } from "react";

export default function BMICalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);

  const calculateBMI = () => {
    if (!weight || !height) return;
    const h = height / 100;
    const result = (weight / (h * h)).toFixed(2);
    setBmi(result);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">BMI Calculator</h1>

      <div className="flex flex-col gap-3 w-64">
        <input
          type="number"
          placeholder="Weight (kg)"
          className="p-2 rounded text-black"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <input
          type="number"
          placeholder="Height (cm)"
          className="p-2 rounded text-black"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <button
          onClick={calculateBMI}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Calculate BMI
        </button>

        {bmi && (
          <p className="mt-4 text-lg">
            Your BMI: <span className="font-bold">{bmi}</span>
          </p>
        )}
      </div>

      <a href="/" className="mt-8 text-blue-400 hover:underline">← Back to Home</a>
    </main>
  );
}
