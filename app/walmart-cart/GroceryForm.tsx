"use client";

import { useState } from "react";

interface GroceryFormProps {
  onSubmit: (items: string[]) => void;
  isLoading: boolean;
}

export function GroceryForm({ onSubmit, isLoading }: GroceryFormProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const items = input
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (items.length > 0) onSubmit(items);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
      <label htmlFor="grocery-input" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
        Grocery list
      </label>
      <textarea
        id="grocery-input"
        rows={8}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={"whole milk gallon\nlarge eggs dozen\nsourdough bread\ncheddar cheese"}
        disabled={isLoading}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 14,
          fontFamily: "inherit",
          borderRadius: 8,
          border: "1px solid #ccc",
          resize: "vertical",
        }}
      />
      <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
        One item per line — up to 50 items.
      </p>
      <button
        type="submit"
        disabled={isLoading || input.trim().length === 0}
        style={{
          marginTop: 12,
          padding: "10px 24px",
          fontSize: 15,
          fontWeight: 600,
          borderRadius: 8,
          border: "none",
          background: isLoading ? "#aaa" : "#0071dc",
          color: "#fff",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Building cart…" : "Generate Walmart Cart"}
      </button>
    </form>
  );
}
