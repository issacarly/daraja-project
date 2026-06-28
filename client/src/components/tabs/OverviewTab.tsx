"use client";
// components/tabs/OverviewTab.tsx
// The first tab — shows the full picture: term summaries, strand heatmap,
// most recent assessment results, and a "pick up where you left off" card.

import { Trophy, BookOpen, ClipboardList, Video, TrendingUp, ChevronRight, Flame } from "lucide-react";
import type { Subject, TermBlock, CompetencyLevel } from "@/types/subject";
import { TERM_LABELS, COMPETENCY_META } from "@/types/subject";

function CompetencyPill({ level }: { level: CompetencyLevel }) {
  const m = COMPETENCY_META[level];
  return (
    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: m.bg, color: m.color }}>
      {level} — {m.label}
    </span>
  );
}

function MiniLadder({ level, color }: { level: number; color: string }) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4].map((r) => (
        <div key={r} className="h-1.5 w-5 rounded-full transition-all"
          style={{ backgroundColor: r <= level ? color : "#e2e8f0" }} />
      ))}
    </div>
  );
}

function TermSummaryCard({
  term, color, isCurrent,
}: { term: TermBlock; color: string; isCurrent: boolean }) {
  const totalLessons    = term.lessons.length;
  const doneLessons     = term.lessons.filter((l) => l.isCompleted).length;
  const totalAssess     = term.assessments.length;
  const doneAssess      = term.assessments.filter((a) => a.isSubmitted).length;
  const liveCount       = term.liveClasses.filter((lc) => lc.status === "SCHEDULED" || lc.status === "LIVE").length;
  const pct             = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;

  const lastResult = [...term.assessments].reverse().find((a) => a.isSubmitted && a.competencyLevel);

  return (
    <div
      className="glass-card rounded-2xl p-5"
      style={isCurrent ? { boxShadow: `0 0 0 2px ${color}` } : {}}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-slate-800 text-sm">{TERM_LABELS[term.term]}</h3>
        {isCurrent && (
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${color}18`, color }}>
            Current
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div>
          <p className="text-base font-black text-slate-800">{doneLessons}/{totalLessons}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Lessons</p>
        </div>
        <div>
          <p className="text-base font-black text-slate-800">{doneAssess}/{totalAssess}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Assessed</p>
        </div>
        <div>
          <p className="text-base font-black text-slate-800">{liveCount}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Live</p>
        </div>
      </div>

      {lastResult?.competencyLevel && (
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 mb-1">Last result</p>
          <CompetencyPill level={lastResult.competencyLevel} />
        </div>
      )}
    </div>
  );
}

export default function OverviewTab({
  subject, onTabChange,
}: { subject: Subject; onTabChange: (tab: string) => void }) {
  const { terms, progressPercentage } = subject;
  const color = subject.color;

  // Derive strand progress from all completed lessons
  const strandMap: Record<string, { done: number; total: number }> = {};
  terms.forEach((t) =>
    t.lessons.forEach((l) => {
      strandMap[l.strand] = strandMap[l.strand] ?? { done: 0, total: 0 };
      strandMap[l.strand].total++;
      if (l.isCompleted) strandMap[l.strand].done++;
    })
  );
  const strands = Object.entries(strandMap).map(([name, { done, total }]) => ({
    name,
    done,
    total,
    pct: Math.round((done / total) * 100),
    level: Math.max(1, Math.ceil((done / total) * 4)) as 1 | 2 | 3 | 4,
  }));

  // Next incomplete lesson
  const nextLesson = terms
    .flatMap((t) => t.lessons)
    .find((l) => !l.isCompleted && !l.isLocked);

  // Upcoming live class
  const nextLive = terms
    .flatMap((t) => t.liveClasses)
    .filter((lc) => lc.status === "SCHEDULED" || lc.status === "LIVE")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];

  const totalLessons = terms.reduce((s, t) => s + t.lessons.length, 0);
  const doneLessons  = terms.reduce((s, t) => s + t.lessons.filter((l) => l.isCompleted).length, 0);

  return (
    <div className="space-y-8">

      {/* Hero progress card */}
      <div
        className="rounded-3xl p-6 md:p-8 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${color}, #1d4ed8)` }}
      >
        <div className="absolute right-0 top-0 w-48 h-48 rounded-full opacity-10 bg-white translate-x-16 -translate-y-16" />
        <div className="absolute right-8 bottom-0 w-32 h-32 rounded-full opacity-10 bg-white translate-y-12" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={18} className="text-yellow-300" fill="#fde047" />
            <span className="text-sm font-bold text-white/80">Subject progress</span>
          </div>
          <div className="flex items-end gap-4 mb-4">
            <span className="text-5xl font-black">{progressPercentage}%</span>
            <span className="text-white/70 text-sm mb-1">{doneLessons} of {totalLessons} lessons done</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Continue learning */}
      {nextLesson && (
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Continue where you left off</h2>
          <button
            onClick={() => onTabChange("lessons")}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 group hover:shadow-md transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18`, color }}>
              <BookOpen size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-0.5">Next lesson</p>
              <p className="font-bold text-slate-800 truncate">{nextLesson.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{nextLesson.strand} · {nextLesson.durationMinutes} min</p>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 group-hover:text-slate-500 transition-all shrink-0" />
          </button>
        </div>
      )}

      {/* Upcoming live class */}
      {nextLive && (
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Live class</h2>
          <button
            onClick={() => onTabChange("live-classes")}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 group hover:shadow-md transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-red-50">
              {nextLive.status === "LIVE" ? (
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              ) : (
                <Video size={22} className="text-red-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-0.5">
                {nextLive.status === "LIVE" ? "🔴 Live now" : "Upcoming"}
              </p>
              <p className="font-bold text-slate-800 truncate">{nextLive.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{nextLive.teacherName} · {nextLive.durationMinutes} min</p>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 group-hover:text-slate-500 transition-all shrink-0" />
          </button>
        </div>
      )}

      {/* Term summaries */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Term overview</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {terms.map((t, i) => (
            <TermSummaryCard key={t.term} term={t} color={color} isCurrent={i === 0} />
          ))}
        </div>
      </div>

      {/* Strand progress */}
      {strands.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Strands</h2>
          <div className="glass-card rounded-2xl p-5 space-y-4">
            {strands.map(({ name, done, total, pct, level }) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-semibold text-slate-700">{name}</p>
                  <div className="flex items-center gap-3">
                    <MiniLadder level={level} color={color} />
                    <span className="text-xs font-semibold text-slate-400">{done}/{total}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Quick access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Lessons",      icon: BookOpen,     tab: "lessons",       count: totalLessons       },
            { label: "Assessments",  icon: ClipboardList,tab: "assessments",   count: terms.reduce((s, t) => s + t.assessments.length, 0) },
            { label: "Past Papers",  icon: Trophy,       tab: "past-papers",   count: terms.reduce((s, t) => s + t.pastPapers.length, 0)   },
            { label: "Live Classes", icon: Video,        tab: "live-classes",  count: terms.reduce((s, t) => s + t.liveClasses.length, 0)   },
          ].map(({ label, icon: Icon, tab, count }) => (
            <button key={tab} onClick={() => onTabChange(tab)}
              className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 text-center hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${color}15`, color }}>
                <Icon size={18} strokeWidth={2} />
              </div>
              <p className="text-xs font-bold text-slate-700">{label}</p>
              <p className="text-[10px] text-slate-400">{count} items</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
