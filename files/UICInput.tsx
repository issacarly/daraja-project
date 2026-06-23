"use client";
// components/auth/UICInput.tsx
// Drop-in registration field for school UIC code.
// Supports: type UIC directly OR search by school name.
// Validates against the DB before allowing form submission.
// Usage:
//   <UICInput onSelect={(institution) => setFormData(prev => ({
//     ...prev, institutionId: institution.id, uic: institution.uic
//   }))} />

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, CheckCircle2, XCircle, Building2, Loader2 } from "lucide-react";

interface Institution {
  id: number;
  uic: string;
  name: string;
  classes?: number;
}

interface UICInputProps {
  onSelect: (institution: Institution | null) => void;
  required?: boolean;
  className?: string;
}

type SearchMode = "uic" | "name";
type ValidationState = "idle" | "loading" | "valid" | "invalid";

export default function UICInput({ onSelect, required = true, className = "" }: UICInputProps) {
  const [mode, setMode] = useState<SearchMode>("uic");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Institution[]>([]);
  const [selected, setSelected] = useState<Institution | null>(null);
  const [validationState, setValidationState] = useState<ValidationState>("idle");
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = useCallback(async (value: string) => {
    if (value.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const param = mode === "uic" ? `q=${encodeURIComponent(value)}` : `name=${encodeURIComponent(value)}`;
    const res = await fetch(`/api/institutions/lookup?${param}`);
    const data = await res.json();

    if (data.results) {
      setSuggestions(data.results);
      setShowDropdown(data.results.length > 0);
    }
  }, [mode]);

  const validateUIC = useCallback(async (code: string) => {
    if (code.length !== 4) return;
    setValidationState("loading");
    try {
      const res = await fetch(`/api/institutions/lookup?q=${encodeURIComponent(code.toUpperCase())}`);
      const data = await res.json();
      if (data.found && data.institution) {
        setValidationState("valid");
        setSelected(data.institution);
        onSelect(data.institution);
        setErrorMessage("");
      } else {
        setValidationState("invalid");
        setSelected(null);
        onSelect(null);
        setErrorMessage("UIC code not found. Check the code or search by school name.");
      }
    } catch {
      setValidationState("invalid");
      setErrorMessage("Could not verify. Please check your connection.");
    }
  }, [onSelect]);

  const handleChange = (value: string) => {
    setQuery(value);
    setSelected(null);
    onSelect(null);
    setValidationState("idle");
    setErrorMessage("");

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (mode === "uic") {
      const upper = value.toUpperCase();
      setQuery(upper);
      if (upper.length === 4) {
        debounceRef.current = setTimeout(() => validateUIC(upper), 400);
      } else if (upper.length > 1) {
        debounceRef.current = setTimeout(() => search(upper), 300);
      }
    } else {
      debounceRef.current = setTimeout(() => search(value), 300);
    }
  };

  const handleSelect = (institution: Institution) => {
    setSelected(institution);
    setQuery(mode === "uic" ? institution.uic : institution.name);
    setValidationState("valid");
    setSuggestions([]);
    setShowDropdown(false);
    onSelect(institution);
    setErrorMessage("");
  };

  const handleClear = () => {
    setQuery("");
    setSelected(null);
    setValidationState("idle");
    setSuggestions([]);
    setShowDropdown(false);
    onSelect(null);
    setErrorMessage("");
  };

  const switchMode = (newMode: SearchMode) => {
    setMode(newMode);
    handleClear();
  };

  const borderColor = {
    idle: "border-slate-200 focus-within:border-sky-400",
    loading: "border-sky-400",
    valid: "border-emerald-400",
    invalid: "border-red-400",
  }[validationState];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Mode toggle */}
      <div className="flex gap-1 mb-2">
        <button
          type="button"
          onClick={() => switchMode("uic")}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            mode === "uic"
              ? "bg-sky-100 text-sky-700 border border-sky-200"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Enter UIC code
        </button>
        <button
          type="button"
          onClick={() => switchMode("name")}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            mode === "name"
              ? "bg-sky-100 text-sky-700 border border-sky-200"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Search by school name
        </button>
      </div>

      {/* Input */}
      <div
        className={`glass-card flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all ${borderColor}`}
      >
        {validationState === "loading" ? (
          <Loader2 size={16} className="text-sky-500 animate-spin shrink-0" />
        ) : (
          <Search size={16} className="text-slate-400 shrink-0" />
        )}

        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder={
            mode === "uic"
              ? "Enter 4-character UIC code (e.g. 5FCP)"
              : "Type your school name…"
          }
          maxLength={mode === "uic" ? 4 : 100}
          required={required}
          className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none uppercase-input"
          style={{ textTransform: mode === "uic" ? "uppercase" : "none" }}
          autoComplete="off"
          spellCheck={false}
        />

        {query && (
          <button type="button" onClick={handleClear} className="shrink-0">
            <XCircle size={16} className="text-slate-300 hover:text-slate-500 transition-colors" />
          </button>
        )}

        {validationState === "valid" && (
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
        )}
      </div>

      {/* Autocomplete dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full glass rounded-xl border border-white/50 shadow-lg overflow-hidden">
          {suggestions.map((inst) => (
            <button
              key={inst.uic}
              type="button"
              onClick={() => handleSelect(inst)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-sky-50/80 transition-colors text-left"
            >
              <Building2 size={14} className="text-slate-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{inst.name}</p>
                <p className="text-xs text-slate-400">UIC: {inst.uic}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Confirmed institution card */}
      {selected && validationState === "valid" && (
        <div className="mt-2 flex items-center gap-2.5 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
          <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-emerald-800">{selected.name}</p>
            <p className="text-xs text-emerald-600">UIC: {selected.uic}</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMessage && validationState === "invalid" && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <XCircle size={12} />
          {errorMessage}
        </p>
      )}

      {/* Helper text */}
      {validationState === "idle" && !query && (
        <p className="mt-1.5 text-xs text-slate-400">
          Your school&apos;s UIC code links your account to your institution.
          Ask your school administrator if you don&apos;t have it.
        </p>
      )}
    </div>
  );
}
