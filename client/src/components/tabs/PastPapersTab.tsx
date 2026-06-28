"use client";
// components/tabs/PastPapersTab.tsx
// Displays archived past papers grouped by year and term.
// Covers school papers, KNEC-style papers, and mock papers.

import { useState } from "react";
import { FileText, Download, Eye, Calendar, BookMarked, Award } from "lucide-react";
import type { TermBlock, PastPaper, CBCTerm } from "@/types/subject";
import { TERM_LABELS } from "@/types/subject";

const PAPER_TYPE_META = {
  SCHOOL: { label: "School Paper", color: "#0ea5e9", bg: "rgba(14,165,233,0.1)",  icon: BookMarked },
  KNEC:   { label: "KNEC Paper",   color: "#10b981", bg: "rgba(16,185,129,0.1)",  icon: Award      },
  MOCK:   { label: "Mock Exam",    color: "#7c3aed", bg: "rgba(124,58,237,0.1)",  icon: FileText   },
};

function PaperCard({ paper, color }: { paper: PastPaper; color: string }) {
  const meta = PAPER_TYPE_META[paper.type] ?? PAPER_TYPE_META.SCHOOL;
  const Icon = meta.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
      {/* Colored top stripe */}
      <div className="h-1.5 w-full" style={{ backgroundColor: meta.color }} />

      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: meta.bg, color: meta.color }}>
            <Icon size={18} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: meta.color }}>
              {meta.label}
            </span>
            <h3 className="font-bold text-slate-800 text-sm leading-snug mt-0.5 truncate">{paper.title}</h3>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-400 shrink-0">
            <Calendar size={11} /> {paper.year}
          </div>
        </div>

        {paper.description && (
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">{paper.description}</p>
        )}

        <div className="flex gap-2 mt-3">
          <a
            href={paper.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 rounded-xl border text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-all hover:bg-slate-50"
            style={{ borderColor: meta.color, color: meta.color }}
          >
            <Eye size={13} /> View
          </a>
          <a
            href={paper.fileUrl}
            download
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-white text-center flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
            style={{ backgroundColor: meta.color }}
          >
            <Download size={13} /> Download
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PastPapersTab({
  terms, color,
}: { terms: TermBlock[]; color: string }) {
  const [filterTerm, setFilterTerm] = useState<CBCTerm | "ALL">("ALL");
  const [filterType, setFilterType] = useState<string>("ALL");

  // Flatten all papers from all terms
  const allPapers = terms.flatMap((t) =>
    t.pastPapers.map((p) => ({ ...p, termLabel: TERM_LABELS[t.term] }))
  );

  const filtered = allPapers.filter((p) => {
    const matchTerm = filterTerm === "ALL" || p.term === filterTerm;
    const matchType = filterType === "ALL" || p.type === filterType;
    return matchTerm && matchType;
  });

  // Group by year descending
  const byYear = filtered.reduce<Record<number, typeof filtered>>((acc, p) => {
    (acc[p.year] = acc[p.year] ?? []).push(p);
    return acc;
  }, {});

  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  return (
    <div>
      {/* Intro callout */}
      <div className="glass-card rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
        <BookMarked size={18} className="text-sky-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-slate-800">Practise with past papers</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Download or view school exam papers, KNEC-style assessments, and mock exams.
            Past paper practice strengthens your CBA scores.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1 glass-card rounded-xl p-1">
          {[{ id: "ALL", label: "All terms" }, ...terms.map((t) => ({ id: t.term, label: TERM_LABELS[t.term] }))].map(({ id, label }) => (
            <button key={id} onClick={() => setFilterTerm(id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterTerm === id ? "text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
              style={filterTerm === id ? { backgroundColor: color } : {}}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 glass-card rounded-xl p-1">
          {[
            { id: "ALL",    label: "All types" },
            { id: "SCHOOL", label: "School"    },
            { id: "KNEC",   label: "KNEC"      },
            { id: "MOCK",   label: "Mock"       },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setFilterType(id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterType === id ? "text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
              style={filterType === id ? { backgroundColor: color } : {}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Papers by year */}
      {years.length === 0 ? (
        <div className="p-8 text-center glass-card rounded-2xl text-slate-400 text-sm">
          No past papers match your filter.
        </div>
      ) : (
        years.map((year) => (
          <div key={year} className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1 flex items-center gap-2">
              <Calendar size={12} /> {year}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {byYear[year].map((paper) => (
                <PaperCard key={paper.id} paper={paper} color={color} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
