"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Flame,
  BookOpen,
  Calculator,
  FlaskConical,
  Palette,
  Globe2,
  Sparkles,
  Trophy,
} from "lucide-react";
import { getAllSubjects } from "@/app/actions/subject";

const IconMap: Record<string, React.ComponentType<any>> = {
  Flame,
  BookOpen,
  Calculator,
  FlaskConical,
  Palette,
  Globe2,
  Sparkles,
  Trophy,
};

function CompetencyLadder({ level, tint, compact = false }: { level: number; tint: string; compact?: boolean }) {
  const COMPETENCY_LEVELS = ["Below Expectation", "Approaching Expectation", "Meeting Expectation", "Exceeding Expectation"];
  
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Competency level: ${COMPETENCY_LEVELS[level - 1]}`}>
      {[1, 2, 3, 4].map((rung) => (
        <div
          key={rung}
          className={compact ? "h-1.5 w-3 rounded-full" : "h-2 w-4 rounded-full"}
          style={{
            backgroundColor: rung <= level ? tint : "#e2e8f0",
            opacity: rung <= level ? 1 : 0.7,
          }}
        />
      ))}
    </div>
  );
}

function SubjectCard({ subject, index }: { subject: any; index: number }) {
  const hexToRgba = (hex: string, alpha: number) => {
    if (!hex || hex.length < 7) return `rgba(14,165,233,${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const tintSoft = hexToRgba(subject.color, 0.1);
  const Icon = IconMap[subject.icon] || BookOpen;

  return (
    <Link
      href={`/dashboard/subject/${subject.id}`}
      className="glass-card rounded-2xl p-5 cursor-pointer group block hover:shadow-md transition-all"
      style={{ animation: `slideUp 0.6s ease-out ${index * 0.08}s both` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          className="h-11 w-11 rounded-xl flex items-center justify-center font-bold" 
          style={{ backgroundColor: tintSoft, color: subject.color || "#0ea5e9" }}
        >
          <Icon size={20} strokeWidth={2} />
        </div>
        <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all mt-1" />
      </div>

      <h3 className="font-semibold text-slate-800 text-[15px] leading-tight">{subject.name}</h3>
      <p className="text-xs text-slate-400 mt-0.5 mb-3">Grade {subject.grade?.replace("GRADE_", "") || "X"}</p>

      <div className="flex items-center justify-between">
        <CompetencyLadder level={2} tint={subject.color} />
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: tintSoft, color: subject.color }}>
          0%
        </span>
      </div>
    </Link>
  );
}

export default function SubjectsSidebar({ userGrade }: { userGrade: string }) {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getAllSubjects()
      .then((res) => {
        if (cancelled) return;

        if (!res.success || !res.subjects) {
          setIsLoading(false);
          return;
        }

        // Filter subjects by user's grade
        const mapped = userGrade.toUpperCase().replace(" ", "_");
        const gradeSubjects = res.subjects.filter((s: any) => s.grade === mapped);

        setSubjects(gradeSubjects);
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userGrade]);

  if (isLoading) {
    return (
      <aside className="w-full md:w-[320px] bg-white border-r border-slate-100 p-6">
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full md:max-w-[320px] bg-white border-r border-slate-100 p-6 max-h-screen overflow-y-auto">
      <div className="mb-6">
        <h2 className="font-bold text-slate-800 text-lg mb-2">Your Subjects</h2>
        <p className="text-xs text-slate-400">Grade {userGrade?.replace("GRADE_", "") || "X"}</p>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-slate-500">No subjects found for your grade.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subjects.map((subject, i) => (
            <SubjectCard key={subject.id} subject={subject} index={i} />
          ))}
        </div>
      )}
    </aside>
  );
}
