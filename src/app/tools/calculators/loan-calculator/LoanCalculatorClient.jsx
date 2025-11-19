// src/app/tools/calculators/loan-calculator/LoanCalculatorClient.jsx
"use client";

import { useState } from "react";

function formatMoney(value) {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function LoanCalculatorClient() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const reset = () => {
    setAmount("");
    setRate("");
    setYears("");
    setResult(null);
    setError("");
  };

  const calculate = () => {
    setError("");
    setResult(null);

    const P = Number(amount);
    const R = Number(rate);
    const T = Number(years);

    if (P <= 0) return setError("Enter a valid loan amount.");
    if (R <= 0) return setError("Enter a valid interest rate.");
    if (T <= 0) return setError("Enter a valid loan tenure (years).");

    const monthlyRate = R / 12 / 100;
    const months = T * 12;

    const emi =
      (P * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayable = emi * months;
    const totalInterest = totalPayable - P;

    setResult({
      emi: emi.toFixed(2),
      totalPayable: totalPayable.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      months,
    });
  };

  const copyResult = async () => {
    if (!result) return;
    const text = `EMI: ${result.emi}, Total Interest: ${result.totalInterest}, Total Payable: ${result.totalPayable}`;
    await navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl max-w-md mx-auto">
      <div className="space-y-4">
        <input
          placeholder="Loan Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input w-full"
        />

        <input
          placeholder="Annual Interest Rate (%)"
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="input w-full"
        />

        <input
          placeholder="Loan Tenure (Years)"
          type="number"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          className="input w-full"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button onClick={calculate} className="btn btn-primary w-full">
            Calculate EMI
          </button>

          <button onClick={reset} className="btn btn-secondary w-full">
            Reset
          </button>
        </div>

        {result && (
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 mt-4">
            <p className="text-gray-400 text-sm">Monthly EMI</p>
            <p className="text-xl font-bold text-blue-400 mb-3">
              {formatMoney(result.emi)}
            </p>

            <p className="text-gray-400 text-sm">Total Interest</p>
            <p className="text-lg text-gray-200 mb-3">
              {formatMoney(result.totalInterest)}
            </p>

            <p className="text-gray-400 text-sm">Total Amount Payable</p>
            <p className="text-lg font-semibold text-green-400">
              {formatMoney(result.totalPayable)}
            </p>

            <button onClick={copyResult} className="btn btn-ghost mt-4">
              Copy Result
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
