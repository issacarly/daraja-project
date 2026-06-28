"use client";
// app/(student)/subjects/[id]/page.tsx
// The full Daraja subject page — replaces the original thin version.
// Drop-in: same file path and props contract as before.
// All tab state is local; data is fetched via your existing server action.

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Home, Calculator, BookOpen, FlaskConical,
  Palette, Globe2, Flame, Trophy, Sparkles,
  LayoutDashboard, ClipboardList, FileText, Video,
} from "lucide-react";

// ── Tab components ──
import OverviewTab    from "@/components/tabs/OverviewTab";
import LessonsTab     from "@/components/tabs/LessonsTab";
import AssessmentsTab from "@/components/tabs/AssessmentsTab";
import PastPapersTab  from "@/components/tabs/PastPapersTab";
import LiveClassesTab from "@/components/tabs/LiveClassesTab";

// ── Types & mock data ──
import type { Subject, SubjectTab, CBCTerm } from "@/types/subject";
import { SUBJECT_TABS } from "@/types/subject";
import { getMockSubject } from "@/lib/subject-mock-data";

// ── (Optional) Your real server action ──
// import { getSubjectDetails } from "@/app/actions/subject";

const IconMap: Record<string, React.ElementType> = {
  Calculator, BookOpen, FlaskConical, Palette, Globe2,
  Flame, Trophy, Sparkles,
};

const TAB_ICONS: Record<SubjectTab, React.ElementType> = {
  "overview":     LayoutDashboard,
  "lessons":      BookOpen,
  "assessments":  ClipboardList,
  "past-papers":  FileText,
  "live-classes": Video,
};

function hexToRgba(hex: string, alpha: number) {
  if (!hex || hex.length < 7) return `rgba(14,165,233,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── Tab nav bar ────────────────────────────────────────────────────────────

function TabNav({ active, color, onChange }: {
  active: SubjectTab; color: string; onChange: (t: SubjectTab) => void;
}) {
  return (
    <div className="sticky top-[65px] z-20 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-5 flex gap-0 overflow-x-auto no-scrollbar">
        {SUBJECT_TABS.map(({ id, label }) => {
          const Icon = TAB_ICONS[id];
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? "border-current"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
              style={isActive ? { color, borderColor: color } : {}}
            >
              <Icon size={15} strokeWidth={2} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Subject header ─────────────────────────────────────────────────────────

function SubjectHeader({ subject }: { subject: Subject }) {
  const Icon = IconMap[subject.icon] ?? BookOpen;
  const color = subject.color;
  const tintSoft = hexToRgba(color, 0.12);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10"
      style={{ animation: "slideUp 0.6s ease-out both" }}>
      <div
        className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center shadow-xl shrink-0"
        style={{
          backgroundColor: color,
          boxShadow: `0 12px 28px -6px ${hexToRgba(color, 0.45)}`,
        }}
      >
        <Icon size={44} className="text-white" strokeWidth={2} />
      </div>

      <div className="flex-1">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2"
          style={{ backgroundColor: tintSoft, color }}
        >
          <Sparkles size={11} />
          {subject.grade.replace("_", " ")}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mb-2">
          {subject.name}
        </h1>
        {subject.description && (
          <p className="text-slate-500 font-medium leading-relaxed">{subject.description}</p>
        )}

        {/* Quick stat strip */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3">
          {[
            { label: "Terms",    v: subject.terms.length },
            { label: "Lessons",  v: subject.terms.reduce((s, t) => s + t.lessons.length, 0) },
            { label: "Quizzes",  v: subject.terms.reduce((s, t) => s + t.assessments.length, 0) },
            { label: "Papers",   v: subject.terms.reduce((s, t) => s + t.pastPapers.length, 0) },
          ].map(({ label, v }) => (
            <div key={label} className="flex items-baseline gap-1">
              <span className="text-lg font-black text-slate-800">{v}</span>
              <span className="text-xs text-slate-400 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState("");
  const [subject,     setSubject]     = useState<Subject | null>(null);
  const [activeTab,   setActiveTab]   = useState<SubjectTab>("overview");
  const [activeTerm,  setActiveTerm]  = useState<CBCTerm>("TERM_1");

  useEffect(() => {
    // ── Replace with your real server action: ──
    // getSubjectDetails(id, studentId).then(res => { ... })
    setTimeout(() => {
      setSubject(getMockSubject(id));
      setIsLoading(false);
    }, 600);
  }, [id]);

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="h-12 w-12 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading subject…</p>
      </div>
    );
  }

  // ── Error ──
  if (error || !subject) {
    return (
      <div className="min-h-screen w-full p-8 bg-slate-50">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-6">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="p-6 bg-red-50 text-red-600 rounded-2xl font-medium border border-red-200">
          {error || "Subject not found."}
        </div>
      </div>
    );
  }

  const color = subject.color;

  return (
    <div className="min-h-screen w-full pb-24" style={{ backgroundColor: "#f8fafc" }}>

      {/* Top nav bar */}
      <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full hover:bg-slate-100 transition-colors text-slate-500 flex items-center justify-center"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-sky-600 transition-colors">
              <Home size={16} strokeWidth={2.5} /> Dashboard
            </Link>
          </div>
          <span className="font-bold text-slate-800 text-base sm:hidden truncate px-4">{subject.name}</span>
          <div className="w-10" />
        </div>
      </div>

      {/* Tab nav */}
      <TabNav active={activeTab} color={color} onChange={setActiveTab} />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 py-8 md:py-10 animate-fade-in">
        <SubjectHeader subject={subject} />

        {activeTab === "overview" && (
          <OverviewTab subject={subject} onTabChange={(t) => setActiveTab(t as SubjectTab)} />
        )}
        {activeTab === "lessons" && (
          <LessonsTab
            terms={subject.terms}
            color={color}
            activeTerm={activeTerm}
            onTermChange={setActiveTerm}
          />
        )}
        {activeTab === "assessments" && (
          <AssessmentsTab
            terms={subject.terms}
            color={color}
            activeTerm={activeTerm}
            onTermChange={setActiveTerm}
          />
        )}
        {activeTab === "past-papers" && (
          <PastPapersTab terms={subject.terms} color={color} />
        )}
        {activeTab === "live-classes" && (
          <LiveClassesTab terms={subject.terms} color={color} />
        )}
      </div>
    </div>
  );
}
