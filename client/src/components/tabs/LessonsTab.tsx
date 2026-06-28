"use client";
// components/tabs/LessonsTab.tsx

import { useState } from "react";
import {
  PlayCircle, FileText, Presentation, BookOpen, Lock,
  CheckCircle2, Clock, ChevronRight, Layers
} from "lucide-react";
import type { TermBlock, Lesson, CBCTerm } from "@/types/subject";
import { TERM_LABELS } from "@/types/subject";

const CONTENT_ICONS: Record<string, any> = {
  VIDEO:    PlayCircle,
  PDF:      FileText,
  SLIDES:   Presentation,
  READING:  BookOpen,
  ACTIVITY: Layers,
};

const CONTENT_LABELS: Record<string, string> = {
  VIDEO:    "Video lesson",
  PDF:      "PDF resource",
  SLIDES:   "Slide deck",
  READING:  "Reading",
  ACTIVITY: "Activity",
};

function LessonCard({
  lesson, color, index, onOpen,
}: { lesson: Lesson; color: string; index: number; onOpen: (l: Lesson) => void }) {
  const Icon = CONTENT_ICONS[lesson.contentType] ?? BookOpen;
  const completed = lesson.isCompleted;
  const locked = lesson.isLocked;

  return (
    <button
      onClick={() => !locked && onOpen(lesson)}
      disabled={locked}
      className={`w-full group flex items-center gap-4 p-4 rounded-2xl border transition-all text-left
        ${locked
          ? "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed"
          : completed
            ? "bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md"
            : "bg-white border-slate-200 hover:shadow-md"
        }`}
      style={{
        animation: `slideUp 0.4s ease-out ${index * 0.05}s both`,
        ...((!locked && !completed) ? { borderLeftColor: color, borderLeftWidth: 3 } : {}),
      }}
    >
      {/* Icon bubble */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{
          backgroundColor: locked ? "#f1f5f9" : completed ? "rgba(16,185,129,0.1)" : `${color}18`,
          color: locked ? "#94a3b8" : completed ? "#10b981" : color,
        }}
      >
        {locked ? <Lock size={18} /> : <Icon size={20} strokeWidth={2} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className={`font-semibold text-sm truncate ${locked ? "text-slate-400" : "text-slate-800"}`}>
            {lesson.title}
          </p>
          {lesson.subStrand && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 shrink-0 hidden sm:inline">
              {lesson.subStrand}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>{CONTENT_LABELS[lesson.contentType]}</span>
          {lesson.durationMinutes && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock size={11} /> {lesson.durationMinutes} min
              </span>
            </>
          )}
          {lesson.strand && (
            <>
              <span>·</span>
              <span>{lesson.strand}</span>
            </>
          )}
        </div>
      </div>

      <div className="shrink-0">
        {completed ? (
          <CheckCircle2 size={20} className="text-emerald-500" />
        ) : locked ? (
          <Lock size={16} className="text-slate-300" />
        ) : (
          <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
        )}
      </div>
    </button>
  );
}

// ─── Lesson Viewer Modal ────────────────────────────────────────────────────

function LessonViewer({ lesson, color, onClose }: { lesson: Lesson; color: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{lesson.strand}</span>
            <h2 className="text-xl font-bold text-slate-800 mt-1">{lesson.title}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors text-lg font-bold">×</button>
        </div>

        <div className="p-6">
          {/* Video embed */}
          {lesson.videoUrl && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 mb-6">
              <iframe
                src={lesson.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lesson.title}
              />
            </div>
          )}

          {/* PDF viewer link */}
          {lesson.pdfUrl && !lesson.videoUrl && (
            <a
              href={lesson.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all mb-6"
            >
              <FileText size={22} className="text-sky-600" />
              <div>
                <p className="font-semibold text-slate-800">Open PDF Resource</p>
                <p className="text-xs text-slate-400">Opens in a new tab</p>
              </div>
              <ChevronRight size={18} className="ml-auto text-slate-300" />
            </a>
          )}

          {/* Reading content */}
          {lesson.readingContent && (
            <div className="prose prose-slate prose-sm max-w-none mb-6" dangerouslySetInnerHTML={{ __html: lesson.readingContent }} />
          )}

          {/* Teacher notes */}
          {lesson.notes && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <p className="text-xs font-bold text-amber-700 mb-1 uppercase tracking-wide">Teacher notes</p>
              <p className="text-sm text-amber-800">{lesson.notes}</p>
            </div>
          )}

          {/* Mark complete */}
          <button
            className="mt-6 w-full py-3 rounded-2xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: color }}
          >
            {lesson.isCompleted ? "✓ Completed" : "Mark as Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function LessonsTab({
  terms, color, activeTerm, onTermChange,
}: { terms: TermBlock[]; color: string; activeTerm: CBCTerm; onTermChange: (t: CBCTerm) => void }) {
  const [openLesson, setOpenLesson] = useState<Lesson | null>(null);
  const termData = terms.find((t) => t.term === activeTerm) ?? terms[0];
  const lessons = termData?.lessons ?? [];
  const completed = lessons.filter((l) => l.isCompleted).length;

  return (
    <div>
      {/* Term switcher */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {terms.map((t) => {
          const done = t.lessons.filter((l) => l.isCompleted).length;
          const total = t.lessons.length;
          return (
            <button
              key={t.term}
              onClick={() => onTermChange(t.term)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTerm === t.term ? "text-white shadow-sm" : "glass-card text-slate-600 hover:text-slate-800"
              }`}
              style={activeTerm === t.term ? { backgroundColor: color } : {}}
            >
              {TERM_LABELS[t.term]}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTerm === t.term ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                {done}/{total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress micro-bar */}
      <div className="glass-card rounded-2xl px-5 py-3 mb-5 flex items-center gap-4">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${lessons.length ? (completed / lessons.length) * 100 : 0}%`, backgroundColor: color }}
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 shrink-0">
          {completed} of {lessons.length} done
        </span>
      </div>

      {/* Lesson list */}
      {lessons.length === 0 ? (
        <div className="p-8 text-center glass-card rounded-2xl text-slate-400 text-sm">
          No lessons added for {TERM_LABELS[activeTerm]} yet.
        </div>
      ) : (
        <div className="space-y-2.5">
          {lessons.map((lesson, i) => (
            <LessonCard key={lesson.id} lesson={lesson} color={color} index={i} onOpen={setOpenLesson} />
          ))}
        </div>
      )}

      {openLesson && (
        <LessonViewer lesson={openLesson} color={color} onClose={() => setOpenLesson(null)} />
      )}
    </div>
  );
}
