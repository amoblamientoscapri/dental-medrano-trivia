"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Localidad {
  nombre: string;
  provincia: string;
}

interface LocalidadInputProps {
  value: string;
  provincia: string;
  onChange: (localidad: string, provincia: string) => void;
  inputClassName?: string;
}

export function LocalidadInput({ value, provincia, onChange, inputClassName }: LocalidadInputProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Localidad[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/localidades?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
        setActiveIndex(-1);
      }
    } catch {
      // ignore
    }
  }, []);

  function handleInputChange(val: string) {
    setQuery(val);
    onChange(val, "");

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSuggestions(val), 300);
  }

  function selectItem(loc: Localidad) {
    setQuery(loc.nombre);
    onChange(loc.nombre, loc.provincia);
    setOpen(false);
    setSuggestions([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectItem(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder="Ej: Córdoba, Rosario..."
        autoComplete="off"
        className={inputClassName}
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-auto">
          {suggestions.map((loc, i) => (
            <li
              key={`${loc.nombre}-${loc.provincia}`}
              onMouseDown={() => selectItem(loc)}
              className={`px-4 py-2 cursor-pointer text-sm ${
                i === activeIndex ? "bg-orange-50 text-orange-brand" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="font-medium">{loc.nombre}</span>
              <span className="text-gray-400 ml-1">({loc.provincia})</span>
            </li>
          ))}
        </ul>
      )}
      {provincia && (
        <input type="hidden" name="provincia" value={provincia} />
      )}
    </div>
  );
}
