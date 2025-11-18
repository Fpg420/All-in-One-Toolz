// src/app/tools/calculators/simple-interest-calculator/page.js
export const metadata = {
  title: "Interest Calculator — Simple & Compound Interest",
  description:
    "Calculate simple or compound interest. Choose principal, annual rate, time in years and compounding frequency to see interest earned and total amount. Fast, private and accurate.",
};

import InterestCalculatorClient from "./InterestCalculatorClient";

export default function InterestCalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-blue-400">Interest Calculator</h1>

        <p className="text-gray-300 mb-6">
          Calculate simple or compound interest for loans, savings, and investments. Enter the
          principal (initial amount), annual interest rate, and time in years. For compound interest,
          choose how often interest compounds (yearly, quarterly, monthly, daily) to get an accurate total.
          All calculations run in your browser — nothing is uploaded.
        </p>

        <InterestCalculatorClient />

        <section className="mt-8 text-gray-400">
          <h2 className="text-xl font-semibold mb-2">What this tool does</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Simple interest: interest = P × R × T / 100</li>
            <li>Compound interest: A = P × (1 + r/n)^(n×t), where n is compounding frequency</li>
            <li>Shows total amount (principal + interest) and interest earned</li>
          </ul>

          <h3 className="text-sm font-semibold mt-4 mb-1">Examples</h3>
          <p>✔ $1,000 at 5% for 3 years (simple) → interest = $150, total = $1,150</p>
          <p>✔ $1,000 at 5% for 3 years (compounded monthly) → total ≈ $1,161.47</p>

          <p className="mt-4 text-sm">
            Use this calculator for quick budgeting, loan estimates, or savings planning. For large financial
            decisions consult a financial advisor.
          </p>
        </section>
      </div>
    </main>
  );
}
