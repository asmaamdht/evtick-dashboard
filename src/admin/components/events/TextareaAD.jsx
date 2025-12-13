import React from "react";

export default function TextareaAD({ label, value, onChange, rows, error }) {
  const maxWords = 70;

  const countWords = (text) => {
    if (!text) return 0;
    const matches = text.match(/\b\w+\b/g);
    return matches ? matches.length : 0;
  };

  const wordCount = countWords(value);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (countWords(newValue) <= maxWords) {
      onChange(newValue);
    }
  };

  return (
    <div className="mt-2 relative">
      <label>{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={handleChange}
        className={`w-full border p-2 rounded mt-1 ${error ? "border-red-500" : ""}`}
      />
      <div className="flex justify-between mt-1 text-xs">
        {error && <span className="text-red-500">{error}</span>}
        <span className={`text-gray-400 ml-auto ${wordCount >= maxWords ? "text-red-500" : ""}`}>
          {wordCount}/{maxWords}
        </span>
      </div>
    </div>
  );
}
