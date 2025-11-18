// src/app/tools/calculators/discount-calculator/page.js
export const metadata = {
  title: "Discount Calculator — All-in-One Toolz",
  description:
    "Discount Calculator — quickly compute discounted price, savings, and reverse discount (find discount from final price). Fast, private and easy to use for shopping and budgeting.",
};

import DiscountCalculatorClient from "./DiscountCalculatorClient";

export default function DiscountCalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-blue-400">Discount Calculator</h1>

        <p className="text-gray-300 mb-6">
          Quickly calculate discounted prices and see how much you save. This tool supports forward
          calculations (apply X% discount) and reverse calculations (given final price, find the
          discount percent). Calculations happen locally in your browser — nothing is uploaded.
        </p>

        <DiscountCalculatorClient />

        <section className="mt-8 text-gray-400">
          <h2 className="text-xl font-semibold mb-2">Use cases</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Find final price after a sale discount</li>
            <li>See how much money you save in absolute terms</li>
            <li>Given a final sale price, infer the discount percent</li>
          </ul>

          <h3 className="text-sm font-semibold mt-4 mb-1">Examples</h3>
          <p>✔ $100 at 25% off → Final price = $75 (You save $25)</p>
          <p>✔ Final price $75 from $100 → discount = 25%</p>

          <p className="mt-4 text-sm">
            Page is SEO-friendly and optimized for shopping, finance and deal-hunting queries.
          </p>
        </section>
      </div>
    </main>
  );
}
