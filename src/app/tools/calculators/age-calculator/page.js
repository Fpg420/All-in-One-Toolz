// src/app/tools/calculators/age-calculator/page.js
import dynamic from "next/dynamic";

export const metadata = {
  title: "Age Calculator — All-in-One Toolz",
  description: "Calculate age in years, months and days from a birth date. Fast, private, and easy to use.",
};

const AgeCalculatorClient = dynamic(() => import("./AgeCalculatorClient"), { ssr: false });

export default function AgeCalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-3 text-blue-400">Age Calculator</h1>

        <p className="text-gray-300 mb-6">
          Quickly compute someone's age (years, months and days) from their date of birth.
          This tool is helpful for age verification, milestone planning, or just curiosity.
          All calculations run in your browser — no personal data is sent to our servers.
        </p>

        {/* Client-side interactive calculator */}
        <AgeCalculatorClient />

        {/* SEO and helpful content for AdSense & discoverability */}
        <section className="mt-8 text-gray-400">
          <h2 className="text-xl font-semibold mb-2">How the Age Calculator works</h2>
          <p className="mb-2">
            Enter a birth date and (optionally) a reference date to calculate the exact age in
            years, months, and days. If no reference date is provided, today’s date is used.
            The calculation accounts for months of different lengths and leap years.
          </p>

          <h3 className="text-sm font-semibold mt-4 mb-1">Privacy & usage</h3>
          <p className="text-sm">
            We do not store the dates you enter. All computations are performed locally in your
            browser for privacy. If you need to calculate ages in bulk or integrate this into a
            form, consider server-side processing with proper data handling.
          </p>
        </section>
      </div>
    </main>
  );
}
