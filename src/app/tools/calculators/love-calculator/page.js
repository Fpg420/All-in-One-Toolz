// src/app/tools/calculators/love-calculator/page.js
export const metadata = {
  title: "Love Calculator — All-in-One Toolz",
  description:
    "Love Calculator — a fun, deterministic compatibility tester. Enter two names to get a playful compatibility score and short description. For entertainment only.",
};

import LoveCalculatorClient from "./LoveCalculatorClient";

export default function LoveCalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-3 text-pink-400">Love Calculator</h1>

        <p className="text-gray-300 mb-6">
          A light-hearted compatibility checker — enter two names and receive a fun, deterministic
          compatibility score and a short message. This tool is for entertainment only and does not
          predict real-life relationships.
        </p>

        <LoveCalculatorClient />

        <section className="mt-8 text-gray-400">
          <h2 className="text-xl font-semibold mb-2">How it works</h2>
          <p className="mb-2">
            The calculator uses a simple deterministic algorithm so the same pair of names will always
            produce the same result. No names are stored or sent to servers — all computation happens
            in your browser.
          </p>

          <h3 className="text-sm font-semibold mt-4 mb-1">Privacy</h3>
          <p className="text-sm">
            We do not collect or store the names you provide. This feature is purely for entertainment.
          </p>
        </section>
      </div>
    </main>
  );
}
