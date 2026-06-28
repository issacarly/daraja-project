"use client";
// components/tabs/AssessmentsTab.tsx
// Shows formative quizzes, mid-term tests, and end-term exams per term.
// Includes an interactive quiz runner for MCQ/True-False/Short Answer.

import { useState } from "react";
import {
  ClipboardList, Trophy, AlertCircle, CheckCircle2, Clock,
  ChevronRight, Play, Lock, BarChart3
} from "lucide-react";
import type { TermBlock, Assessment, Question, CompetencyLevel, CBCTerm } from "@/types/subject";
import { TERM_LABELS, COMPETENCY_META, ASSESSMENT_TYPE_META } from "@/types/subject";

const TYPE_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  FORMATIVE_QUIZ: { label: "Formative Quiz",  color: "#0ea5e9", bg: "rgba(14,165,233,0.1)",  icon: ClipboardList },
  MID_TERM_TEST:  { label: "Mid-Term Test",   color: "#7c3aed", bg: "rgba(124,58,237,0.1)",  icon: BarChart3     },
  END_TERM_EXAM:  { label: "End-Term Exam",   color: "#e11d48", bg: "rgba(225,29,72,0.1)",   icon: Trophy        },
  PROJECT:        { label: "Project",         color: "#0d9488", bg: "rgba(13,148,136,0.1)",  icon: ClipboardList },
  PRACTICAL:      { label: "Practical",       color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  icon: ClipboardList },
};

// ─── Assessment Card ────────────────────────────────────────────────────────

function AssessmentCard({ assessment, color, onStart }: {
  assessment: Assessment; color: string; onStart: (a: Assessment) => void;
}) {
  const meta = TYPE_META[assessment.type] ?? TYPE_META.FORMATIVE_QUIZ;
  const Icon = meta.icon;
  const comp = assessment.competencyLevel ? COMPETENCY_META[assessment.competencyLevel] : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: meta.bg, color: meta.color }}>
              <Icon size={18} strokeWidth={2} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: meta.color }}>
                {meta.label}
              </span>
              <h3 className="font-bold text-slate-800 text-sm leading-snug mt-0.5">{assessment.title}</h3>
            </div>
          </div>
          {assessment.isSubmitted && comp && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
              style={{ backgroundColor: comp.bg, color: comp.color }}>
              {assessment.competencyLevel}
            </span>
          )}
        </div>

        {assessment.description && (
          <p className="text-sm text-slate-500 mb-3 leading-relaxed">{assessment.description}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
          {assessment.timeLimitMinutes && (
            <span className="flex items-center gap-1"><Clock size={12} /> {assessment.timeLimitMinutes} min</span>
          )}
          <span>{assessment.totalMarks} marks</span>
          {assessment.questions.length > 0 && (
            <span>{assessment.questions.length} questions</span>
          )}
        </div>

        {/* Score bar if submitted */}
        {assessment.isSubmitted && assessment.score != null && (
          <div className="mb-4">
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>Your score</span>
              <span style={{ color: comp?.color }}>{assessment.score}/{assessment.totalMarks}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(assessment.score / assessment.totalMarks) * 100}%`,
                  backgroundColor: comp?.color ?? color,
                }}
              />
            </div>
          </div>
        )}

        {/* Action button */}
        {assessment.isSubmitted ? (
          <button className="w-full py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <BarChart3 size={15} /> View Results
          </button>
        ) : assessment.isAvailable && assessment.questions.length > 0 ? (
          <button
            onClick={() => onStart(assessment)}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: meta.color }}
          >
            <Play size={15} /> Start {meta.label}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm text-slate-400 py-2">
            <Lock size={14} />
            {assessment.isAvailable ? "No questions added yet" : "Not available yet"}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Quiz Runner ────────────────────────────────────────────────────────────

function QuizRunner({ assessment, color, onClose }: {
  assessment: Assessment; color: string; onClose: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(assessment.timeLimitMinutes ? assessment.timeLimitMinutes * 60 : null);
  const questions = assessment.questions;
  const q = questions[current];

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const score = submitted
    ? questions.reduce((acc, q) => {
        const correct = q.correctAnswer && answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
        return acc + (correct ? q.marks : 0);
      }, 0)
    : 0;

  const pct = (score / assessment.totalMarks) * 100;
  const level: CompetencyLevel = pct >= 80 ? "EE" : pct >= 60 ? "ME" : pct >= 40 ? "AE" : "BE";

  if (submitted) {
    const comp = COMPETENCY_META[level];
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-black"
            style={{ backgroundColor: comp.bg, color: comp.color }}>
            {level}
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-1">{score}/{assessment.totalMarks}</h2>
          <p className="font-semibold mb-1" style={{ color: comp.color }}>{comp.label}</p>
          <p className="text-sm text-slate-500 mb-6">{comp.description}</p>

          <div className="space-y-3 text-left mb-6">
            {questions.map((q) => {
              const correct = q.correctAnswer && answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
              return (
                <div key={q.id} className={`p-3 rounded-xl text-sm ${correct ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
                  <p className={`font-medium ${correct ? "text-emerald-800" : "text-red-800"}`}>{q.text}</p>
                  {q.explanation && <p className="text-xs mt-1 text-slate-500">{q.explanation}</p>}
                </div>
              );
            })}
          </div>

          <button onClick={onClose} className="w-full py-3 rounded-2xl font-bold text-white" style={{ backgroundColor: color }}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{assessment.title}</p>
            <p className="text-sm font-semibold text-slate-600">Question {current + 1} of {questions.length}</p>
          </div>
          <div className="flex items-center gap-3">
            {timeLeft && (
              <div className="flex items-center gap-1 text-sm font-bold text-slate-600">
                <Clock size={14} />
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
              </div>
            )}
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">×</button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="px-6 pt-4 flex gap-1.5">
          {questions.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-all"
              style={{ backgroundColor: i < current ? color : i === current ? `${color}80` : "#e2e8f0" }} />
          ))}
        </div>

        {/* Question */}
        <div className="p-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{q.strand}</span>
            <span className="text-xs text-slate-300">· {q.marks} {q.marks === 1 ? "mark" : "marks"}</span>
          </div>
          <p className="text-lg font-bold text-slate-800 mb-6 leading-snug">{q.text}</p>

          {q.imageUrl && (
            <img src={q.imageUrl} alt="Question image" className="rounded-xl mb-4 max-h-48 object-contain" />
          )}

          {/* MCQ */}
          {q.type === "MCQ" && q.options && (
            <div className="space-y-2.5">
              {q.options.map((opt) => (
                <button key={opt} onClick={() => handleAnswer(q.id, opt)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    answers[q.id] === opt
                      ? "border-2 text-white"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  style={answers[q.id] === opt ? { borderColor: color, backgroundColor: color } : {}}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* True/False */}
          {q.type === "TRUE_FALSE" && (
            <div className="flex gap-3">
              {["True", "False"].map((opt) => (
                <button key={opt} onClick={() => handleAnswer(q.id, opt)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                    answers[q.id] === opt ? "text-white border-transparent" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                  style={answers[q.id] === opt ? { backgroundColor: color } : {}}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Short answer / Fill blank / Essay */}
          {(q.type === "SHORT_ANSWER" || q.type === "FILL_BLANK" || q.type === "ESSAY") && (
            <textarea
              value={answers[q.id] ?? ""}
              onChange={(e) => handleAnswer(q.id, e.target.value)}
              placeholder={q.type === "ESSAY" ? "Write your answer here…" : "Your answer…"}
              rows={q.type === "ESSAY" ? 6 : 2}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-sky-400 transition-colors resize-none"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="sticky bottom-0 bg-white rounded-b-3xl px-6 py-4 border-t border-slate-100 flex gap-3">
          {current > 0 && (
            <button onClick={() => setCurrent((c) => c - 1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Back
            </button>
          )}
          {current < questions.length - 1 ? (
            <button onClick={() => setCurrent((c) => c + 1)} disabled={!answers[q.id]}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
              style={{ backgroundColor: color }}>
              Next
            </button>
          ) : (
            <button onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length < questions.filter((q) => q.type !== "ESSAY").length}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
              style={{ backgroundColor: "#10b981" }}>
              Submit Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AssessmentsTab({
  terms, color, activeTerm, onTermChange,
}: { terms: TermBlock[]; color: string; activeTerm: CBCTerm; onTermChange: (t: CBCTerm) => void }) {
  const [activeQuiz, setActiveQuiz] = useState<Assessment | null>(null);
  const termData = terms.find((t) => t.term === activeTerm) ?? terms[0];
  const assessments = termData?.assessments ?? [];

  const formative  = assessments.filter((a) => a.type === "FORMATIVE_QUIZ");
  const midTerm    = assessments.filter((a) => a.type === "MID_TERM_TEST");
  const endTerm    = assessments.filter((a) => a.type === "END_TERM_EXAM");
  const projects   = assessments.filter((a) => a.type === "PROJECT" || a.type === "PRACTICAL");

  const Section = ({ title, items }: { title: string; items: Assessment[] }) =>
    items.length > 0 ? (
      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1">{title}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((a) => (
            <AssessmentCard key={a.id} assessment={a} color={color} onStart={setActiveQuiz} />
          ))}
        </div>
      </div>
    ) : null;

  return (
    <div>
      {/* Term switcher */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {terms.map((t) => {
          const submitted = t.assessments.filter((a) => a.isSubmitted).length;
          const total = t.assessments.length;
          return (
            <button key={t.term} onClick={() => onTermChange(t.term)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTerm === t.term ? "text-white shadow-sm" : "glass-card text-slate-600"
              }`}
              style={activeTerm === t.term ? { backgroundColor: color } : {}}>
              {TERM_LABELS[t.term]}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTerm === t.term ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                {submitted}/{total}
              </span>
            </button>
          );
        })}
      </div>

      <Section title="Formative Assessments · Quizzes" items={formative} />
      <Section title="Mid-Term Test"                   items={midTerm}   />
      <Section title="End-Term Examination"            items={endTerm}   />
      <Section title="Projects & Practicals"           items={projects}  />

      {assessments.length === 0 && (
        <div className="p-8 text-center glass-card rounded-2xl text-slate-400 text-sm">
          No assessments for {TERM_LABELS[activeTerm]} yet.
        </div>
      )}

      {activeQuiz && (
        <QuizRunner assessment={activeQuiz} color={color} onClose={() => setActiveQuiz(null)} />
      )}
    </div>
  );
}
