// src/components/ToolGrid.jsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function ToolGrid({ initialCategories }) {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return initialCategories;
    return initialCategories
      .map((cat) => ({
        ...cat,
        tools: cat.tools.filter((tool) => tool.name.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.tools.length > 0);
  }, [initialCategories, search]);

  return (
    <section className="py-8">
      <div className="text-center mb-8">
        <label htmlFor="tool-search" className="sr-only">
          Search tools
        </label>
        <input
          id="tool-search"
          type="search"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded-lg text-gray-900 w-80"
          aria-label="Search tools"
        />
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center text-gray-400">No tools matched your search.</div>
      ) : (
        filteredCategories.map((category) => (
          <div key={category.name} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-blue-300">{category.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.tools.map((tool) => (
                <Link
                  key={tool.path}
                  href={tool.path}
                  className="p-5 rounded-2xl bg-gray-800 hover:bg-gray-700 transition shadow-lg border border-gray-700"
                  aria-label={`Open ${tool.name}`}
                >
                  <h3 className="text-lg font-semibold text-gray-100">{tool.name}</h3>
                  <p className="text-gray-400 text-sm mt-2">Click to use the {tool.name}.</p>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
