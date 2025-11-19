// src/app/tools/calculators/simple-interest-calculator/page.js
export const metadata = {
  title: "Interest Calculator — Simple & Compound Interest",
  description:
    "Calculate simple and compound interest quickly. Enter principal, annual rate and time in years. Choose compounding frequency to see interest earned and total amount.",
};

import InterestCalculatorClient from "./InterestCalculatorClient";

export default function InterestCalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-blue-400">Interest Calculator</h1>

        <p className="text-gray-300 mb-6">
          Calculate simple or compound interest for loans, savings and investments. Enter the principal
          (initial amount), annual interest rate (percent), and time in years. For compound interest,
          select how often interest compounds (yearly, monthly, daily, etc.) for an accurate total.
          All calculations run in your browser — nothing is uploaded or stored.
        </p>

        <InterestCalculatorClient />

        <section className="mt-8 text-gray-400">
          <h2 className="text-xl font-semibold mb-2">How it works</h2>
          <p className="mb-2">
            Simple interest uses the formula <code>I = P × R × T / 100</code>.
            Compound interest uses <code>A = P × (1 + r/n)^(n×t)</code> where <code>n</code> is the number
            of compounding periods per year and <code>r</code> is the annual rate in decimal.
          </p>

          <h3 className="text-sm font-semibold mt-4 mb-1">Examples</h3>
          <p>• $1,000 at 5% for 3 years (simple) → interest = $150, total = $1,150.</p>
          <p>• $1,000 at 5% for 3 years (compounded monthly) → total ≈ $1,161.47.</p>

          <p className="mt-4 text-sm">
            This page is SEO optimized for finance and education queries. For large or professional calculations consult a financial advisor.
          </p>
        </section>
      </div>
    </main>
  );
}
