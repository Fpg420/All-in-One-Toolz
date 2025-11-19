// src/app/tools/calculators/percentage-calculator/page.js

export const metadata = {
  title: "Percentage Calculator — Fast & Easy Online Tool",
  description:
    "Use this free Percentage Calculator to find percentages, reverse percentages, and value differences. Fast, accurate and works offline. Perfect for math, shopping, finance and homework.",
};

import PercentageCalculatorClient from "./PercentageCalculatorClient";

export default function PercentageCalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-blue-400">Percentage Calculator</h1>

        <p className="text-gray-300 mb-8">
          This free Percentage Calculator helps you easily compute percentages, reverse percentages,
          and value differences — like finding “What is 15% of 200?” or “20 is what percent of 80?”.
          All calculations happen instantly in your browser — nothing is stored.
        </p>

        <PercentageCalculatorClient />

        <section className="mt-8 text-gray-400">
          <h2 className="text-xl font-semibold mb-2">What this tool can do</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Find percentage of any number</li>
            <li>Reverse percentage (value from percentage)</li>
            <li>Solve percent change problems</li>
            <li>Private — all calculations stay on your device</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-1">Examples</h3>
          <p>✔ 15% of 500 = 75</p>
          <p>✔ 25 is what percent of 200? → 12.5%</p>

          <p className="mt-4 text-sm">
            This page is SEO-friendly and optimized for math, finance, and education-related search results.
          </p>
        </section>
      </div>
    </main>
  );
}
