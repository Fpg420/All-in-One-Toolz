// src/app/tools/calculators/loan-calculator/page.js

export const metadata = {
  title: "Loan & EMI Calculator — Monthly Payment, Interest & Total Cost",
  description:
    "Free Loan & EMI Calculator. Calculate monthly EMI, total interest, and total payable amount for home loans, car loans, personal loans, and more. Fast and accurate.",
};

import LoanCalculatorClient from "./LoanCalculatorClient";

export default function LoanCalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-6">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-4 text-blue-400">Loan & EMI Calculator</h1>

        <p className="text-gray-300 mb-8">
          Easily calculate your EMI (Equated Monthly Installment) based on loan amount, annual
          interest rate, and loan tenure in years. This free tool also shows your total interest
          payable and total amount payable over the entire loan period.
        </p>

        <LoanCalculatorClient />

        <section className="mt-10 text-gray-400">
          <h2 className="text-xl font-semibold mb-2">How EMI is calculated</h2>
          <p className="mb-3">
            EMI is calculated using the standard formula:
          </p>
          <code className="block bg-gray-900 p-3 rounded border border-gray-700 text-sm">
            EMI = P × r × (1 + r)<sup>n</sup> / ((1 + r)<sup>n</sup> − 1)
          </code>

          <p className="mt-4">
            Where P = loan amount, r = monthly interest rate, and n = total months.
          </p>

          <h3 className="text-lg mt-6 font-semibold">Examples</h3>
          <p>• ₹1,00,000 at 10% for 1 year → EMI ≈ ₹8,791</p>
          <p>• $10,000 at 5% for 3 years → EMI ≈ $299.71</p>

          <p className="mt-4 text-sm">
            This page is SEO-optimized for finance and loan-related search queries.
          </p>
        </section>

      </div>
    </main>
  );
}
