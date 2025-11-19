// src/app/tools/calculators/tax-calculator/page.js

export const metadata = {
  title: "Tax Calculator — Income Tax, Slabs, Effective Rate",
  description:
    "Free online tax calculator. Calculate income tax using flat tax rates or progressive tax slabs. Shows total tax payable and effective tax rate. Fast and accurate.",
};

import TaxCalculatorClient from "./TaxCalculatorClient";

export default function TaxCalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-6">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-4 text-blue-400">Income Tax Calculator</h1>

        <p className="text-gray-300 mb-8">
          Calculate your income tax instantly using flat tax rates or progressive tax brackets.
          This tool works for any country — enter your own tax slabs or use a simple percentage.
          Shows total tax, effective tax rate, and a complete breakdown.
        </p>

        <TaxCalculatorClient />

        <section className="mt-10 text-gray-400">
          <h2 className="text-xl font-semibold mb-2">How tax calculation works</h2>
          <p className="mb-3">
            You can choose between:
          </p>
          <ul className="list-disc ml-6 space-y-1 mb-4">
            <li><strong>Flat tax</strong> — same percentage on all income.</li>
            <li><strong>Progressive slabs</strong> — different tax rates for different income levels.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-1">Examples</h3>
          <p>• Flat 10% on ₹500,000 → Tax = ₹50,000</p>
          <p>• Progressive: 10% on first 250k, 20% on next 250k → Tax = ₹75,000</p>

          <p className="mt-4 text-sm">
            This page is SEO-optimized for finance, salary, and tax-related search queries.
            Always consult a tax professional for legal advice.
          </p>
        </section>

      </div>
    </main>
  );
}
