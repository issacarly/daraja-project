"use client";

import React, { useState, useEffect } from "react";
import {
  Flame, BookOpen, Calculator, FlaskConical, Palette, Globe2,
  ChevronRight, Clock, Trophy, Sparkles, ArrowRight, CheckCircle2,
  ArrowLeft, Home
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Daraja — Student Learning Dashboard
 * Design system extends the Daraja landing page tokens:
 *  - bg: #f8fafc, text: #1e293b
 *  - primary gradient: #0ea5e9 -> #1d4ed8
 *  - gold accent: #fbbf24 (reserved for the signature competency ladder + streak)
 *  - glass-card surfaces, slide-up / float motion language
 *
 * Signature element: the Competency Ladder — a 4-rung indicator that maps
 * directly to the real CBC assessment scale (Below / Approaching / Meeting /
 * Exceeding Expectation), used consistently across every learning area card.
 */

const COMPETENCY_LEVELS = [
  "Below Expectation",
  "Approaching Expectation",
  "Meeting Expectation",
  "Exceeding Expectation",
];

const LEARNING_AREAS = [
  {
    id: "math",
    name: "Mathematics",
    strand: "Numbers & Operations",
    icon: Calculator,
    tint: "#fbbf24",
    tintSoft: "rgba(251, 191, 36, 0.12)",
    level: 2,
    nextLesson: "Fractions: Adding unlike denominators",
  },
  {
    id: "science",
    name: "Science & Technology",
    strand: "Living Things & Their Environment",
    icon: FlaskConical,
    tint: "#0d9488",
    tintSoft: "rgba(13, 148, 136, 0.10)",
    level: 3,
    nextLesson: "How plants make their own food",
  },
  {
    id: "english",
    name: "English Activities",
    strand: "Reading & Comprehension",
    icon: Globe2,
    tint: "#7c3aed",
    tintSoft: "rgba(124, 58, 237, 0.10)",
    level: 3,
    nextLesson: "Retelling a short story in your own words",
  },
  {
    id: "kiswahili",
    name: "Kiswahili",
    strand: "Kusoma na Kuandika",
    icon: BookOpen,
    tint: "#e11d48",
    tintSoft: "rgba(225, 29, 72, 0.10)",
    level: 1,
    nextLesson: "Sentensi sahili — mazoezi",
  },
  {
    id: "creative",
    name: "Creative Arts",
    strand: "Art & Craft",
    icon: Palette,
    tint: "#0ea5e9",
    tintSoft: "rgba(14, 165, 233, 0.10)",
    level: 4,
    nextLesson: "Mixing primary colours",
  },
];

function CompetencyLadder({ level, tint, compact = false }) {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`Competency level: ${COMPETENCY_LEVELS[level - 1]}`}
    >
      {[1, 2, 3, 4].map((rung) => (
        <div
          key={rung}
          className={compact ? "h-1.5 w-4 rounded-full" : "h-2 w-6 rounded-full"}
          style={{
            backgroundColor: rung <= level ? tint : "#e2e8f0",
            opacity: rung <= level ? 1 : 0.7,
            transition: "background-color 0.4s ease",
          }}
        />
      ))}
    </div>
  );
}

function LearningAreaCard({ area, index }) {
  const Icon = area.icon;
  return (
    <div
      className="glass-card rounded-2xl p-5 cursor-pointer group"
      style={{
        animation: `slideUp 0.6s ease-out ${index * 0.08}s both`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="h-11 w-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: area.tintSoft }}
        >
          <Icon size={20} style={{ color: area.tint }} strokeWidth={2} />
        </div>
        <ChevronRight
          size={18}
          className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all mt-1"
        />
      </div>

      <h3 className="font-semibold text-slate-800 text-[15px] leading-tight">
        {area.name}
      </h3>
      <p className="text-xs text-slate-400 mt-0.5 mb-4">{area.strand}</p>

      <div className="flex items-center justify-between mb-4">
        <CompetencyLadder level={area.level} tint={area.tint} />
        <span
          className="text-[11px] font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: area.tintSoft, color: area.tint }}
        >
          {COMPETENCY_LEVELS[area.level - 1]}
        </span>
      </div>

      <div className="pt-3 border-t border-slate-100">
        <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">
          Up next
        </p>
        <p className="text-sm text-slate-600 leading-snug">{area.nextLesson}</p>
      </div>
    </div>
  );
}

function StreakBadge({ days }) {
  return (
    <div className="glass-card rounded-2xl px-5 py-4 flex items-center gap-3">
      <div
        className="h-10 w-10 rounded-xl flex items-center justify-center animate-pulse-glow"
        style={{ backgroundColor: "rgba(251, 191, 36, 0.18)" }}
      >
        <Flame size={20} className="text-amber-500" fill="#fbbf24" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-lg font-bold text-slate-800 leading-none">{days} days</p>
        <p className="text-xs text-slate-400 mt-1">Learning streak</p>
      </div>
    </div>
  );
}

function TodayStrip() {
  const tasks = [
    { label: "Mathematics — Fractions quiz", time: "15 min", done: false },
    { label: "English — Reading passage", time: "10 min", done: false },
    { label: "Science — Watch: Photosynthesis", time: "8 min", done: true },
  ];

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
          <Clock size={15} className="text-sky-600" />
          Today
        </h2>
        <span className="text-xs text-slate-400">{tasks.filter(t => !t.done).length} left</span>
      </div>
      <div className="space-y-2.5">
        {tasks.map((task, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
              task.done ? "opacity-50" : "hover:bg-white/60"
            }`}
          >
            <div
              className="h-5 w-5 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: task.done ? "#0ea5e9" : "transparent",
                border: task.done ? "none" : "2px solid #cbd5e1",
              }}
            >
              {task.done && <CheckCircle2 size={14} className="text-white" />}
            </div>
            <span
              className={`text-sm flex-1 ${
                task.done ? "line-through text-slate-400" : "text-slate-700"
              }`}
            >
              {task.label}
            </span>
            <span className="text-xs text-slate-400">{task.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContinueCard() {
  return (
    <div className="glass-card rounded-2xl p-5 flex items-center gap-4 group cursor-pointer">
      <div className="relative shrink-0">
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="24" fill="none" stroke="#e2e8f0" strokeWidth="5" />
          <circle
            cx="28" cy="28" r="24" fill="none"
            stroke="#0ea5e9" strokeWidth="5" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 24}
            strokeDashoffset={2 * Math.PI * 24 * (1 - 0.62)}
            transform="rotate(-90 28 28)"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
          62%
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-0.5">Continue learning</p>
        <p className="text-sm font-medium text-slate-800 truncate">Mathematics — Fractions</p>
        <p className="text-xs text-slate-400 mt-0.5">Strand 3 of 5 · Numbers &amp; Operations</p>
      </div>
      <ArrowRight size={18} className="text-sky-600 group-hover:translate-x-1 transition-transform shrink-0" />
    </div>
  );
}

export default function StudentDashboard() {
  const router = useRouter();
  const [greeting, setGreeting] = useState("Welcome back");
  const [studentName, setStudentName] = useState("Student");
  const [grade, setGrade] = useState("Grade X");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.name) setStudentName(user.name);
        if (user.grade) setGrade(user.grade);
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);

  const overallLevel =
    LEARNING_AREAS.reduce((sum, a) => sum + a.level, 0) / LEARNING_AREAS.length;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#f8fafc" }}>
      <div className="max-w-5xl mx-auto px-5 py-8 md:py-12">
        {/* Back and Home Buttons */}
        <div className="flex items-center gap-4 mb-6" style={{ animation: "fadeIn 0.8s ease-out both" }}>
          <button onClick={() => router.back()} className="flex items-center gap-2 text-[14px] font-bold text-slate-400 hover:text-sky-600 transition-colors">
            <ArrowLeft size={16} strokeWidth={2.5} /> Back
          </button>
          <Link href="/" className="flex items-center gap-2 text-[14px] font-bold text-slate-400 hover:text-sky-600 transition-colors">
            <Home size={16} strokeWidth={2.5} /> Home
          </Link>
        </div>

        {/* Header */}
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8"
          style={{ animation: "fadeIn 0.8s ease-out both" }}
        >
          <div>
            <p className="text-sm text-slate-400 mb-1">{grade} · CBC</p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              {greeting}, <span className="text-gradient-blue">{studentName}</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              You're closest to <em className="not-italic font-medium text-slate-600">Exceeding Expectation</em> in Creative Arts
            </p>
          </div>
          <StreakBadge days={12} />
        </div>

        {/* Today + Continue row */}
        <div
          className="grid md:grid-cols-2 gap-4 mb-8"
          style={{ animation: "slideUp 0.6s ease-out 0.1s both" }}
        >
          <TodayStrip />
          <ContinueCard />
        </div>

        {/* Learning Areas */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Your learning areas</h2>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Overall</span>
            <CompetencyLadder level={Math.round(overallLevel)} tint="#1d4ed8" compact />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {LEARNING_AREAS.map((area, i) => (
            <LearningAreaCard key={area.id} area={area} index={i} />
          ))}
        </div>

        {/* Footer ladder legend */}
        <div
          className="glass-card rounded-2xl p-4 flex flex-wrap items-center gap-x-6 gap-y-2"
          style={{ animation: "fadeIn 1s ease-out 0.3s both" }}
        >
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Trophy size={13} className="text-slate-400" />
            CBC competency scale
          </span>
          {COMPETENCY_LEVELS.map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="h-1.5 w-4 rounded-full"
                style={{ backgroundColor: i < 4 ? "#0284c7" : "#e2e8f0", opacity: 0.3 + i * 0.23 }}
              />
              <span className="text-[11px] text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
