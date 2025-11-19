// src/app/tools/converters/timezone-converter/TimeZoneConverterClient.jsx
"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Helper: get timezone offset in minutes for a timezone at a specific Date instant.
 * Uses Intl.DateTimeFormat.formatToParts to compute wall-clock fields in that timezone,
 * then compares to the UTC ms to derive offset.
 */
function tzOffsetMinutes(date, timeZone) {
  // format the date as parts in the requested timeZone
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(date).reduce((acc, p) => {
    if (p.type !== "literal") acc[p.type] = p.value;
    return acc;
  }, {});

  const year = Number(parts.year);
  const month = Number(parts.month) - 1;
  const day = Number(parts.day);
  const hour = Number(parts.hour);
  const minute = Number(parts.minute);
  const second = Number(parts.second);

  // get UTC ms for that wall-clock broken-down time interpreted as UTC
  const asUTC = Date.UTC(year, month, day, hour, minute, second);
  // offset minutes = (asUTC - actualInstantMs) / 60000
  return Math.round((asUTC - date.getTime()) / 60000);
}

/**
 * Build a Date (instant) for a given wall-clock date+time in a specific timezone.
 * Approach:
 *  - Create a UTC-based candidate with the same numeric date/time (Date.UTC(...))
 *  - Compute the timezone offset minutes for the target zone at that candidate instant
 *  - Subtract that offset to get the true instant
 */
function instantFromWallClock({ year, month, day, hour, minute, second = 0 }, timeZone) {
  // create a candidate date as if the wall-clock fields were UTC
  const candidateUtcMs = Date.UTC(year, month - 1, day, hour, minute, second);
  // compute offset at this instant for the timezone (in minutes)
  const offsetMin = tzOffsetMinutes(new Date(candidateUtcMs), timeZone);
  // actual instant ms = candidateUtcMs - offsetMin*60*1000
  const actualMs = candidateUtcMs - offsetMin * 60 * 1000;
  return new Date(actualMs);
}

function formatInTimeZone(date, timeZone, opts = {}) {
  return new Intl.DateTimeFormat("en-US", { timeZone, hour12: false, ...opts }).format(date);
}

const COMMON_ZONES = [
  "UTC",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Asia/Karachi",
  "Asia/Dubai",
  "Asia/Tokyo",
  "Asia/Kolkata",
  "Australia/Sydney",
];

export default function TimeZoneConverterClient() {
  const today = new Date();
  const [date, setDate] = useState(() => {
    // default to today's date string yyyy-mm-dd
    return today.toISOString().slice(0, 10);
  });
  const [time, setTime] = useState("12:00");
  const [fromZone, setFromZone] = useState("UTC");
  const [toZone, setToZone] = useState("Asia/Karachi");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // small timezone suggestions for the select; user can still paste any IANA zone string
  const zones = useMemo(() => COMMON_ZONES, []);

  useEffect(() => {
    setError("");
    setResult(null);
  }, [date, time, fromZone, toZone]);

  function parseTimeParts(timeStr) {
    const parts = (timeStr || "00:00").split(":");
    const hour = Number(parts[0] ?? 0);
    const minute = Number(parts[1] ?? 0);
    return { hour, minute, second: 0 };
  }

  function convert() {
    setError("");
    setResult(null);

    if (!date) {
      setError("Please choose a date.");
      return;
    }
    if (!time) {
      setError("Please choose a time.");
      return;
    }
    try {
      // parse date yyyy-mm-dd
      const [y, m, d] = date.split("-").map(Number);
      const { hour, minute, second } = parseTimeParts(time);

      // build instant from wall-clock in fromZone
      const instant = instantFromWallClock(
        { year: y, month: m, day: d, hour, minute, second },
        fromZone
      );

      // format in target zone
      const timeStr = formatInTimeZone(instant, toZone, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      // also provide a friendly time-only output
      const timeOnly = formatInTimeZone(instant, toZone, { hour: "2-digit", minute: "2-digit" });

      setResult({
        instantIso: instant.toISOString(),
        formatted: timeStr,
        timeOnly,
      });
    } catch (e) {
      console.error(e);
      setError("Conversion failed. Make sure zones are valid IANA time zone names (e.g. Asia/Karachi).");
    }
  }

  async function copyResult() {
    if (!result) return;
    const txt = `${result.formatted} (${toZone}) — instant ${result.instantIso}`;
    try {
      await navigator.clipboard.writeText(txt);
    } catch {}
  }

  function clearAll() {
    setDate(today.toISOString().slice(0, 10));
    setTime("12:00");
    setFromZone("UTC");
    setToZone("Asia/Karachi");
    setResult(null);
    setError("");
  }

  return (
    <div className="bg-gray-800/40 p-6 rounded-xl max-w-xl mx-auto">
      <div className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm text-gray-300 mb-1">Date</label>
          <input
            id="date"
            type="date"
            className="input w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Date"
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm text-gray-300 mb-1">Time</label>
          <input
            id="time"
            type="time"
            className="input w-full"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            aria-label="Time"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="fromZone" className="block text-sm text-gray-300 mb-1">From (source zone)</label>
            <input
              id="fromZone"
              list="tz-list"
              className="input w-full"
              value={fromZone}
              onChange={(e) => setFromZone(e.target.value)}
              aria-label="From time zone (IANA name)"
            />
          </div>

          <div>
            <label htmlFor="toZone" className="block text-sm text-gray-300 mb-1">To (target zone)</label>
            <input
              id="toZone"
              list="tz-list"
              className="input w-full"
              value={toZone}
              onChange={(e) => setToZone(e.target.value)}
              aria-label="To time zone (IANA name)"
            />
          </div>

          <datalist id="tz-list">
            {zones.map((z) => (
              <option key={z} value={z} />
            ))}
          </datalist>
        </div>

        <div className="flex gap-3 mt-1">
          <button onClick={convert} className="btn btn-primary">Convert</button>
          <button onClick={clearAll} className="btn btn-secondary">Reset</button>
          <button onClick={copyResult} className="btn btn-ghost" disabled={!result}>Copy</button>
        </div>

        {error && <div role="alert" className="text-rose-400 text-sm mt-2">{error}</div>}

        {result && (
          <div className="mt-4 p-4 rounded bg-gray-900 border border-gray-700">
            <div className="text-sm text-gray-400">Converted (target zone)</div>
            <div className="text-xl font-semibold text-blue-300">{result.timeOnly}</div>
            <div className="text-sm text-gray-400 mt-1">{result.formatted} ({toZone})</div>
            <div className="text-xs text-gray-500 mt-2">Instant (UTC): {result.instantIso}</div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-400">
          Tip: you can paste any IANA time zone name (for example <code>Europe/Paris</code> or <code>America/Los_Angeles</code>) in the
          From/To fields. If you need a full list of time zones, I can add a searchable picker.
        </div>
      </div>
    </div>
  );
}
