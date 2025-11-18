// src/app/tools/calculators/love-calculator/LoveCalculatorClient.jsx
"use client";

import { useEffect, useState } from "react";

/* ---------- Helpers: deterministic hashing + messages ---------- */

function normalize(s) {
  return String(s || "").trim().toLowerCase().replace(/[^a-z0-9\s]/g, "");
}

// djb2-like hash but using bitwise XOR for slightly more distribution
function djb2Hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i);
  }
  // make non-negative 32-bit
  return (h >>> 0);
}

/**
 * Maps two names to a compatibility percent 0..100 deterministically.
 * We bias toward a friendly range while still allowing variety.
 */
function compatibilityPercent(a, b) {
  const s = normalize(a) + "|" + normalize(b);
  const h = djb2Hash(s);
  // map to 0..100
  const pct = h % 101;
  // push extremely low values up a bit so results are more friendly:
  return Math.max(5, pct);
}

function friendlyMessage(pct) {
  if (pct >= 90) return "A magical match — chemistry is through the roof!";
  if (pct >= 75) return "Strong connection — lots of shared potential.";
  if (pct >= 60) return "Good match — worth exploring.";
  if (pct >= 40) return "Some compatibility — could work with effort.";
  return "Tough match — differences may be significant, but surprises happen!";
}

/* ---------- Component ---------- */

export default function LoveCalculatorClient() {
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [pct, setPct] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(t);
  }, [copied]);

  function compute(e) {
    if (e && e.preventDefault) e.preventDefault();
    setError("");
    setPct(null);
    setMessage("");

    if (!nameA.trim() || !nameB.trim()) {
      setError("Please enter both names.");
      return;
    }

    // deterministic result
    const percent = compatibilityPercent(nameA, nameB);
    setPct(percent);
    setMessage(friendlyMessage(percent));
  }

  function clearAll() {
    setNameA("");
    setNameB("");
    setPct(null);
    setMessage("");
    setError("");
  }

  async function copyResult() {
    if (pct == null) return;
    const text = `${nameA.trim()} + ${nameB.trim()} = ${pct}% compatibility — ${message}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function handleSwap() {
    const a = nameA;
    setNameA(nameB);
    setNameB(a);
    // recompute after swap
    setTimeout(() => {
      if (nameB || nameA) {
        const percent = compatibilityPercent(nameB, nameA);
        setPct(percent);
        setMessage(friendlyMessage(percent));
      }
    }, 0);
  }

  return (
    <form
      onSubmit={compute}
      className="bg-gray-800/40 p-6 rounded-xl max-w-md mx-auto"
      aria-labelledby="love-calculator-heading"
    >
      <h2 id="love-calculator-heading" className="sr-only">Love Calculator</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="nameA" className="block text-sm text-gray-300 mb-1">Name 1</label>
          <input
            id="nameA"
            type="text"
            placeholder="e.g. Alice"
            value={nameA}
            onChange={(e) => setNameA(e.target.value)}
            className="input w-full"
            aria-label="First name"
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="nameB" className="block text-sm text-gray-300 mb-1">Name 2</label>
          <input
            id="nameB"
            type="text"
            placeholder="e.g. Bob"
            value={nameB}
            onChange={(e) => setNameB(e.target.value)}
            className="input w-full"
            aria-label="Second name"
            autoComplete="off"
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary" aria-label="Check compatibility">
            Check Compatibility
          </button>

          <button type="button" onClick={clearAll} className="btn btn-secondary" aria-label="Clear form">
            Clear
          </button>

          <button type="button" onClick={handleSwap} className="btn btn-ghost" aria-label="Swap names">
            Swap
          </button>
        </div>

        {error && <div role="alert" className="text-rose-400 text-sm">{error}</div>}

        {pct != null && (
          <div className="mt-4 p-4 rounded bg-gray-900 border border-gray-700" role="status" aria-live="polite">
            <div className="text-sm text-gray-400">Compatibility</div>
            <div className="text-3xl font-semibold text-pink-300">{pct}%</div>
            <div className="mt-2 text-sm text-gray-300">{message}</div>

            <div className="flex gap-2 mt-3">
              <button type="button" onClick={copyResult} className="btn btn-ghost" aria-label="Copy result">
                {copied ? "Copied!" : "Copy"}
              </button>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${nameA} + ${nameB} = ${pct}% ❤️ ${message}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                aria-label="Share on Twitter"
              >
                Share
              </a>
            </div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-400">
          <strong>Note:</strong> This tool is for entertainment only. Results are deterministic (same names → same result) and nothing is saved.
        </div>
      </div>
    </form>
  );
}
