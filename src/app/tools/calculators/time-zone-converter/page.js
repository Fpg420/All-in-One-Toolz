// src/app/tools/converters/timezone-converter/page.js
export const metadata = {
  title: "Time Zone Converter — All-in-One Toolz",
  description:
    "Convert time between time zones. Choose a date and time, pick source and target zones (e.g. UTC, Asia/Karachi, America/New_York) and get the exact converted time.",
};

import TimeZoneConverterClient from "./TimeZoneConverterClient";

export default function TimeZoneConverterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-3 text-blue-400">Time Zone Converter</h1>

        <p className="text-gray-300 mb-6">
          Convert a date and time between world time zones. Choose a date and wall-clock time in a
          source time zone, then select a target time zone to see the exact corresponding local time.
          This tool accounts for daylight saving where applicable.
        </p>

        <TimeZoneConverterClient />

        <section className="mt-8 text-gray-400">
          <h2 className="text-xl font-semibold mb-2">How it works</h2>
          <p className="mb-2">
            The converter builds an exact instant from your chosen date/time in the source time zone
            and formats that instant into the target time zone. This method accounts for DST and
            historical offsets using the browser's <code>Intl</code> capabilities.
          </p>
          <h3 className="text-sm font-semibold mt-4 mb-1">Privacy</h3>
          <p className="text-sm">
            All calculations are done in your browser — nothing is uploaded to our servers.
            Use this tool offline for private conversions.
          </p>
        </section>
      </div>
    </main>
  );
}
