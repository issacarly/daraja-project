"use client";
// components/dashboard/TeacherDashboard.tsx
// Teacher view: class roster per grade, CBC assessment heatmap,
// quiz/exam scores mapped to competency levels, learner progress.
// Extends the Daraja glassmorphism design system (sky/blue + gold accent).

import { useState } from "react";
import {
  Users, BookOpen, TrendingUp, AlertCircle, CheckCircle2,
  ChevronRight, BarChart3, Award, Filter, Search, Clock
} from "lucide-react";

// ─── CBC Constants ─────────────────────────────────────────────────────────

const COMPETENCY_LEVELS = [
  { label: "Below Expectation",       short: "BE",  value: 1, color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
  { label: "Approaching Expectation", short: "AE",  value: 2, color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  { label: "Meeting Expectation",     short: "ME",  value: 3, color: "#0ea5e9", bg: "rgba(14,165,233,0.1)"  },
  { label: "Exceeding Expectation",   short: "EE",  value: 4, color: "#10b981", bg: "rgba(16,185,129,0.1)"  },
];

const LEARNING_AREAS = [
  { id: "math",     name: "Mathematics",        short: "Math"    },
  { id: "english",  name: "English Activities", short: "English" },
  { id: "kisw",     name: "Kiswahili",          short: "Kisw."   },
  { id: "science",  name: "Science & Tech",     short: "Science" },
  { id: "creative", name: "Creative Arts",      short: "Arts"    },
  { id: "social",   name: "Social Studies",     short: "Social"  },
];

// ─── Hardcoded sample data (replace with Prisma queries) ────────────────────

const CLASSES = [
  { id: "grade4a", label: "Grade 4 A", grade: 4, count: 32 },
  { id: "grade5b", label: "Grade 5 B", grade: 5, count: 28 },
  { id: "grade6a", label: "Grade 6 A", grade: 6, count: 30 },
];

const generateStudents = (classId: string, count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${classId}-${i}`,
    name: [
      "Amani Wanjiku", "Brian Otieno", "Cynthia Achieng", "David Kimani",
      "Esther Muthoni", "Felix Odhiambo", "Grace Njeri", "Hassan Abdi",
      "Imani Chebet", "Joyce Wangari", "Kevin Mutua", "Lilian Auma",
      "Mark Kariuki", "Nancy Adhiambo", "Oscar Nganga", "Priscilla Wafula",
      "Quincy Mwenda", "Rose Nduta", "Samuel Kipchoge", "Tabitha Nyambura",
      "Umar Farouk", "Violet Anyango", "William Ochieng", "Xenia Mwangi",
      "Yasmin Halake", "Zephaniah Simiyu", "Alice Kamau", "Ben Omondi",
      "Carol Wachira", "Derrick Onyango", "Ella Moraa", "Frank Muriithi",
    ][i % 32],
    admNo: `${2024 + (i % 3)}/${String(i + 1).padStart(3, "0")}`,
    scores: Object.fromEntries(
      LEARNING_AREAS.map((la) => [
        la.id,
        Math.max(1, Math.min(4, Math.round(1.5 + Math.random() * 2.5 + (i % 4 === 0 ? -1 : 0)))),
      ])
    ),
    quizAvg: Math.round(45 + Math.random() * 50),
    lastActive: `${Math.floor(1 + Math.random() * 7)}d ago`,
    trend: (["up", "stable", "down"] as const)[Math.floor(Math.random() * 3)],
  }));

// ─── Sub-components ──────────────────────────────────────────────────────────

function CompetencyBadge({ level }: { level: number }) {
  const comp = COMPETENCY_LEVELS[level - 1] ?? COMPETENCY_LEVELS[0];
  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold"
      style={{ backgroundColor: comp.bg, color: comp.color }}
      title={comp.label}
    >
      {comp.short}
    </span>
  );
}

function CompetencyBar({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4].map((r) => {
        const c = COMPETENCY_LEVELS[level - 1];
        return (
          <div
            key={r}
            className="h-1.5 w-4 rounded-full"
            style={{ backgroundColor: r <= level ? c.color : "#e2e8f0" }}
          />
        );
      })}
    </div>
  );
}

function StatCard({
  label, value, sub, icon: Icon, tint
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; tint: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-4 flex items-center gap-3"
      style={{ animation: "slideUp 0.5s ease-out both" }}>
      <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${tint}18` }}>
        <Icon size={18} style={{ color: tint }} strokeWidth={2} />
      </div>
      <div>
        <p className="text-lg font-bold text-slate-800 leading-none">{value}</p>
        <p className="text-xs text-slate-400 mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-slate-300 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Heatmap Panel ──────────────────────────────────────────────────────────

function ClassHeatmap({ students }: { students: ReturnType<typeof generateStudents> }) {
  const atRisk = students.filter(
    (s) => Object.values(s.scores).some((v) => v === 1)
  );
  const excelling = students.filter(
    (s) => Object.values(s.scores).every((v) => v >= 3)
  );

  return (
    <div className="glass-card rounded-2xl p-5" style={{ animation: "slideUp 0.6s ease-out 0.1s both" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
          <BarChart3 size={15} className="text-sky-600" />
          Class competency heatmap
        </h2>
        <span className="text-xs text-slate-400">{students.length} learners</span>
      </div>

      {/* Grid: students × learning areas */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: 480 }}>
          <thead>
            <tr>
              <th className="text-left text-slate-400 font-medium pb-2 pr-3 w-32">Learner</th>
              {LEARNING_AREAS.map((la) => (
                <th key={la.id} className="text-center text-slate-400 font-medium pb-2 px-1">
                  {la.short}
                </th>
              ))}
              <th className="text-center text-slate-400 font-medium pb-2 pl-2">Quiz avg</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr
                key={s.id}
                className="border-t border-slate-100/60 hover:bg-white/40 transition-colors"
                style={{ animationDelay: `${i * 0.02}s` }}
              >
                <td className="py-1.5 pr-3">
                  <div>
                    <p className="font-medium text-slate-700 truncate max-w-[120px]">{s.name}</p>
                    <p className="text-slate-400">{s.admNo}</p>
                  </div>
                </td>
                {LEARNING_AREAS.map((la) => (
                  <td key={la.id} className="text-center py-1.5 px-1">
                    <CompetencyBadge level={s.scores[la.id]} />
                  </td>
                ))}
                <td className="text-center py-1.5 pl-2">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: s.quizAvg >= 70 ? "rgba(16,185,129,0.1)" :
                                       s.quizAvg >= 50 ? "rgba(14,165,233,0.1)" : "rgba(239,68,68,0.1)",
                      color: s.quizAvg >= 70 ? "#10b981" : s.quizAvg >= 50 ? "#0ea5e9" : "#ef4444",
                    }}
                  >
                    {s.quizAvg}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
        <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-600 font-medium flex items-center gap-1">
          <AlertCircle size={11} /> {atRisk.length} need support
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium flex items-center gap-1">
          <Award size={11} /> {excelling.length} exceeding across all areas
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-sky-50 text-sky-600 font-medium">
          {students.length - atRisk.length - excelling.length} on track
        </span>
      </div>
    </div>
  );
}

// ─── Student Detail Row ──────────────────────────────────────────────────────

function StudentRow({ student, index }: { student: ReturnType<typeof generateStudents>[0]; index: number }) {
  const avgLevel = Math.round(
    Object.values(student.scores).reduce((a, b) => a + b, 0) / LEARNING_AREAS.length
  );
  const comp = COMPETENCY_LEVELS[avgLevel - 1];

  return (
    <div
      className="glass-card rounded-xl px-4 py-3 flex items-center gap-4 group cursor-pointer"
      style={{ animation: `slideUp 0.5s ease-out ${index * 0.04}s both` }}
    >
      {/* Avatar */}
      <div
        className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
        style={{ backgroundColor: `${comp.color}18`, color: comp.color }}
      >
        {student.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{student.name}</p>
        <p className="text-xs text-slate-400">{student.admNo}</p>
      </div>

      <CompetencyBar level={avgLevel} />

      <span
        className="text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 hidden sm:inline-flex"
        style={{ backgroundColor: comp.bg, color: comp.color }}
      >
        {comp.short}
      </span>

      <span className="text-xs text-slate-400 shrink-0 hidden md:block flex items-center gap-1">
        <Clock size={11} className="inline" /> {student.lastActive}
      </span>

      <span
        className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
        style={{
          backgroundColor: student.quizAvg >= 70 ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
          color: student.quizAvg >= 70 ? "#10b981" : "#f59e0b",
        }}
      >
        {student.quizAvg}%
      </span>

      <ChevronRight
        size={15}
        className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0"
      />
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [view, setView] = useState<"roster" | "heatmap">("heatmap");
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<number | null>(null);

  const allStudents = generateStudents(selectedClass.id, selectedClass.count);

  const filtered = allStudents.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    const matchLevel = !filterLevel ||
      Object.values(s.scores).some((v) => v === filterLevel);
    return matchSearch && matchLevel;
  });

  const avgQuiz = Math.round(allStudents.reduce((a, s) => a + s.quizAvg, 0) / allStudents.length);
  const atRiskCount = allStudents.filter((s) => Object.values(s.scores).some((v) => v === 1)).length;
  const progressCount = allStudents.filter((s) => s.trend === "up").length;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#f8fafc" }}>
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">

        {/* Header */}
        <div className="mb-8" style={{ animation: "fadeIn 0.8s ease-out both" }}>
          <p className="text-sm text-slate-400 mb-1">Teacher Portal · CBC Kenya</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Class <span className="text-gradient-blue">Overview</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Nairobi Primary School · <span className="font-medium text-slate-600">Ms. Akinyi Otieno</span>
          </p>
        </div>

        {/* Class tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {CLASSES.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedClass.id === cls.id
                  ? "bg-sky-600 text-white shadow-sm"
                  : "glass-card text-slate-600 hover:text-sky-600"
              }`}
            >
              {cls.label}
              <span className={`ml-1.5 text-xs ${selectedClass.id === cls.id ? "text-sky-200" : "text-slate-400"}`}>
                {cls.count}
              </span>
            </button>
          ))}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total learners"   value={selectedClass.count} icon={Users}       tint="#0ea5e9" />
          <StatCard label="Class quiz avg"   value={`${avgQuiz}%`}       icon={BookOpen}    tint="#1d4ed8" />
          <StatCard label="Need support"     value={atRiskCount}          icon={AlertCircle} tint="#ef4444" sub="Below Expectation in any area" />
          <StatCard label="Improving trend"  value={progressCount}        icon={TrendingUp}  tint="#10b981" />
        </div>

        {/* View toggle + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex gap-1 glass-card rounded-xl p-1 self-start">
            {(["heatmap", "roster"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                  view === v ? "bg-sky-600 text-white" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {v === "heatmap" ? "Competency heatmap" : "Learner roster"}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-1">
            {/* Search */}
            <div className="glass-card flex items-center gap-2 px-3 py-2 rounded-xl flex-1">
              <Search size={14} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search learner…"
                className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
              />
            </div>

            {/* Filter by competency */}
            <div className="glass-card flex items-center gap-2 px-3 py-2 rounded-xl">
              <Filter size={14} className="text-slate-400 shrink-0" />
              <select
                value={filterLevel ?? ""}
                onChange={(e) => setFilterLevel(e.target.value ? Number(e.target.value) : null)}
                className="bg-transparent text-sm text-slate-700 outline-none"
              >
                <option value="">All levels</option>
                {COMPETENCY_LEVELS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main content */}
        {view === "heatmap" ? (
          <ClassHeatmap students={filtered} />
        ) : (
          <div className="space-y-2" style={{ animation: "fadeIn 0.5s ease-out both" }}>
            {filtered.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 text-center text-slate-400 text-sm">
                No learners match your filter.
              </div>
            ) : (
              filtered.map((s, i) => <StudentRow key={s.id} student={s} index={i} />)
            )}
          </div>
        )}

        {/* CBC Competency legend */}
        <div
          className="glass-card rounded-2xl p-4 mt-6 flex flex-wrap items-center gap-x-5 gap-y-2"
          style={{ animation: "fadeIn 1s ease-out 0.3s both" }}
        >
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-slate-400" />
            CBC competency scale
          </span>
          {COMPETENCY_LEVELS.map((c) => (
            <div key={c.value} className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="text-[11px] text-slate-500">
                <span className="font-semibold">{c.short}</span> — {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
