"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Home,
  BookOpen,
  Calendar,
  Clock,
  Flame,
  Calculator,
  FlaskConical,
  Palette,
  Globe2,
  Sparkles,
  Trophy,
} from "lucide-react";
import { getAllSubjects } from "@/app/actions/subject";
import { buildSubjectContent } from "@/lib/subject-mock-data";

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

export default function SubjectsPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userGrade, setUserGrade] = useState<string>("GRADE_5");

  useEffect(() => {
    let grade = "GRADE_5";
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.grade) {
          grade = user.grade;
          setUserGrade(user.grade);
        }
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }

    const dbGrade = grade.toUpperCase().replace(' ', '_');

    getAllSubjects().then(res => {
      if (res.success) {
        // Filter subjects for current student's grade only
        const gradeSubjects = (res.subjects || []).filter(
          (s: any) => s.grade === dbGrade
        );
        setSubjects(gradeSubjects);
      }
      setIsLoading(false);
    });
  }, []);

  const hexToRgba = (hex: string, alpha: number) => {
    if (!hex) return `rgba(226, 232, 240, ${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="w-full">
      <div className="w-full px-8 py-6 bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-[15px] font-bold text-slate-500 hover:text-sky-600 transition-colors">
              <ArrowLeft size={18} strokeWidth={2.5} /> Back
            </button>
            <div className="h-5 w-[2px] bg-slate-200"></div>
            <Link href="/" className="flex items-center gap-2 text-[15px] font-bold text-slate-500 hover:text-sky-600 transition-colors">
              <Home size={18} strokeWidth={2.5} /> Home
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 px-8 py-12 md:py-16">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-800 mb-2 tracking-tight">My <span className="text-sky-600">Subjects</span></h1>
          <p className="text-lg text-slate-600 font-medium">
            {subjects.length} {subjects.length === 1 ? 'subject' : 'subjects'} for {userGrade.replace('_', ' ')}
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full"></div>
          </div>
        ) : subjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((meta) => {
              const sub = buildSubjectContent(meta);
              const color = sub.color || "#0ea5e9";
              const tintSoft = hexToRgba(color, 0.1);
              const Icon = IconMap[sub.icon] || BookOpen;
              const level = (sub as any).competencyLevel || 2;
              
              const total = sub.terms.reduce((acc: number, t: any) => acc + t.lessons.length, 0);
              const completed = sub.terms.reduce((acc: number, t: any) => acc + t.lessons.filter((l: any) => l.isCompleted).length, 0);
              const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <Link
                  href={`/dashboard/subject/${sub.id}`}
                  key={sub.id}
                  className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-sky-300 transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: tintSoft, color }}
                      >
                        <Icon size={24} strokeWidth={2} />
                      </div>
                      <span className="text-[10px] font-black px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full uppercase tracking-wider">
                        {sub.grade.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-sky-600 transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                      {sub.description || "Explore lessons, assessments, and learning resources."}
                    </p>
                  </div>

                  <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase">
                        <span>Progress</span>
                        <span>{completed}/{total} Lessons</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${progressPct}%`, backgroundColor: color }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Competency</span>
                      <CompetencyLadder level={level} tint={color} compact />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <BookOpen size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No subjects found for your grade.</p>
          </div>
        )}
      </div>
    </div>
  );
}
