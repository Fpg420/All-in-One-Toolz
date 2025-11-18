// src/app/tools/calculators/age-calculator/AgeCalculatorClient.jsx
"use client";

import { useEffect, useState } from "react";

/**
 * Returns { years, months, days } difference between birthDate and refDate (both Date objects)
 * Assumes refDate >= birthDate. Uses calendar month/day differences (not approximate).
 */
function calculateAgeParts(birthDate, refDate) {
  const b = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  const r = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());

  if (r < b) return null;

  let years = r.getFullYear() - b.getFullYear();
  let months = r.getMonth() - b.getMonth();
  let days = r.getDate() - b.getDate();

  if (days < 0) {
    // borrow days from previous month
    const prevMonth = new Date(r.getFullYear(), r.getMonth(), 0); // last day of previous month
    days += prevMonth.getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days };
}

export default function AgeCalculatorClient() {
  const [birthDate, setBirthDate] = useState("");
  const [refDate, setRefDate] = useState(""); // optional reference date
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 1500);
      return () => clearTimeout(t);
    }
  }, [copied]);

  function onCalculate() {
    setError("");
    setResult(null);
    if (!birthDate) {
      setError("Please enter a date of birth.");
      return;
    }

    const b = new Date(birthDate);
    if (isNaN(b.getTime())) {
      setError("Invalid birth date.");
      return;
    }

    const r = refDate ? new Date(refDate) : new Date();
    if (isNaN(r.getTime())) {
      setError("Invalid reference date.");
      return;
    }

    if (r < b) {
      setError("Reference date must be the same or after the birth date.");
      return;
    }

    const parts = calculateAgeParts(b, r);
    if (!parts) {
      setError("Could not compute age with the provided dates.");
      return;
    }

    setResult({ ...parts, reference: r.toISOString().slice(0, 10) });
  }

  function onClear() {
    setBirthDate("");
    setRefDate("");
    setResult(null);
    setError("");
  }

  async function onCopy() {
    if (!result) return;
    const text = `${result.years} years, ${result.months} months, ${result.days} days (as of ${result.reference})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="bg-gray-800/40 p-6 rounded-xl max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <label htmlFor="dob" className="block text-sm mb-1 text-gray-300">
            Date of Birth
          </label>
          <input
            id="dob"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700"
            aria-label="Date of birth"
          />
        </div>

        <div>
          <label htmlFor="refDate" className="block text-sm mb-1 text-gray-300">
            Reference date (optional — leave empty to use today)
          </label>
          <input
            id="refDate"
            type="date"
            value={refDate}
            onChange={(e) => setRefDate(e.target.value)}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700"
            aria-label="Reference date"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCalculate}
            className="btn btn-primary"
            aria-label="Calculate age"
          >
            Calculate Age
          </button>

          <button onClick={onClear} className="btn btn-secondary" aria-label="Clear form">
            Clear
          </button>

          <button
            onClick={onCopy}
            className="btn btn-ghost"
            aria-label="Copy result"
            disabled={!result}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {error && <div role="alert" className="text-rose-400 text-sm mt-2">{error}</div>}

        {result && (
          <div className="mt-4 p-4 rounded bg-gray-900 border border-gray-700">
            <div className="text-sm text-gray-400">Exact age (years / months / days)</div>
            <div className="text-2xl font-semibold text-blue-300">
              {result.years}y {result.months}m {result.days}d
            </div>
            <div className="text-sm text-gray-400 mt-2">As of {result.reference}</div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-400">
          <strong>Notes:</strong> Age calculations account for month lengths and leap years.
          For babies and infants, use pediatric growth charts for health advice. This tool does not
          store any data — it runs completely in your browser.
        </div>
      </div>
    </div>
  );
}
