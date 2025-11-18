// src/app/page.jsx
export const metadata = {
  title: "All-in-One Toolz",
  description: "Smart, fast and secure online tools — converters, downloaders and more.",
};

import ToolGrid from "../components/ToolGrid";

const categories = [
  {
    name: "Calculators",
    tools: [
      { name: "BMI Calculator", path: "/tools/calculators/bmi-calculator" },
      { name: "Age Calculator", path: "/tools/calculators/age-calculator" },
      { name: "Love Calculator", path: "/tools/calculators/love-calculator" },
      { name: "Percentage Calculator", path: "/tools/calculators/percentage-calculator" },
      { name: "Discount Calculator", path: "/tools/calculators/discount-calculator" },
      { name: "Simple Interest Calculator", path: "/tools/calculators/simple-interest-calculator" },
      { name: "Compound Interest Calculator", path: "/tools/calculators/compound-interest-calculator" },
      { name: "Loan / EMI Calculator", path: "/tools/calculators/loan-calculator" },
      { name: "Tax Calculator", path: "/tools/calculators/tax-calculator" },
      { name: "Time Zone Converter", path: "/tools/calculators/timezone-converter" },
    ],
  },
  {
    name: "Converters",
    tools: [
      { name: "Image Converter", path: "/tools/converters/image-converter" },
      { name: "Video Converter", path: "/tools/converters/video-converter" },
      { name: "Audio Converter", path: "/tools/converters/audio-converter" },
      { name: "PDF to Word", path: "/tools/converters/pdf-to-word" },
      { name: "Word to PDF", path: "/tools/converters/word-to-pdf" },
      { name: "Excel to CSV", path: "/tools/converters/excel-to-csv" },
      { name: "Text to PDF", path: "/tools/converters/text-to-pdf" },
      { name: "HTML to PDF", path: "/tools/converters/html-to-pdf" },
      { name: "ZIP / RAR Creator", path: "/tools/converters/zip-creator" },
      { name: "Currency Converter", path: "/tools/converters/currency-converter" },
    ],
  },
  {
    name: "Design Tools",
    tools: [
      { name: "Color Palette Extractor", path: "/tools/designTools/color-palette-extractor" },
      { name: "Favicon Generator", path: "/tools/designTools/favicon-generator" },
      { name: "Font Preview Tool", path: "/tools/designTools/font-preview-tool" },
      { name: "Logo Maker", path: "/tools/designTools/logo-maker" },
      { name: "Mockup Generator", path: "/tools/designTools/mockup-generator" },
      { name: "Pattern Generator", path: "/tools/designTools/pattern-generator" },
      { name: "SVG to PNG", path: "/tools/designTools/svg-to-png" },
    ],
  },
  {
    name: "Developer Tools",
    tools: [
      { name: "Base64 Encoder", path: "/tools/developerTools/base64-encoder" },
      { name: "Color Picker", path: "/tools/developerTools/color-picker" },
      { name: "CSS Minifier", path: "/tools/developerTools/css-minifier" },
      { name: "Data Generator", path: "/tools/developerTools/data-generator" },
      { name: "Hash Generator", path: "/tools/developerTools/hash-generator" },
      { name: "HTML Minifier", path: "/tools/developerTools/html-minifier" },
      { name: "HTML Previewer", path: "/tools/developerTools/html-previewer" },
      { name: "JS Formatter", path: "/tools/developerTools/javascript-formatter" },
      { name: "JSON Formatter", path: "/tools/developerTools/json-formatter" },
      { name: "UUID Generator", path: "/tools/developerTools/uuid-generator" },
    ],
  },
  {
    name: "Fun Tools",
    tools: [
      { name: "Joke Generator", path: "/tools/funTools/joke-generator" },
      { name: "Meme Creator", path: "/tools/funTools/meme-creator" },
      { name: "Trivia Quiz", path: "/tools/funTools/trivia-quiz" },
    ],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4 text-blue-400">All-in-One Toolz</h1>
        <p className="text-gray-300 mb-8">
          Smart, fast and secure online tools — all in one place.
        </p>
      </div>

      {/* MAIN CONTENT + GRID */}
      <div className="max-w-6xl mx-auto">
        {/* interactive search + grid (client component) */}
        <ToolGrid initialCategories={categories} />

        {/* SEO / informational content block for AdSense & quality checks */}
        <section className="container mx-auto py-8 max-w-4xl text-gray-200">
          <h2 className="text-2xl font-bold mb-3">About All-in-One Toolz</h2>
          <p className="mb-4">
            All-in-One Toolz is a collection of fast, free, and secure online utilities designed to
            help you complete common tasks instantly — no installs, no logins. From converters
            (image, audio, video, PDF) to everyday calculators (BMI, age, percentage) and developer
            helpers (base64, JSON formatter), every tool was built to be easy to use on desktop and mobile.
          </p>
          <p>
            We focus on privacy and speed: many tools run directly in your browser and do not require
            personal accounts. We also provide clear information and support — use the Contact page
            if you need help or want to suggest a new feature.
          </p>
        </section>
      </div>
    </main>
  );
}
