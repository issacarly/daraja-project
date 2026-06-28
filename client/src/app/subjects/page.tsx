"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, BookOpen, Calculator, Globe2, Palette, FlaskConical, Flame, Sparkles, Trophy } from "lucide-react";
import { getAllSubjects } from "@/app/actions/subject";

const IconMap: Record<string, any> = {
  Flame, BookOpen, Calculator, FlaskConical, Palette, Globe2, Sparkles, Trophy
};

export default function SubjectsPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllSubjects().then(res => {
      if (res.success) {
        setSubjects(res.subjects || []);
      }
      setIsLoading(false);
    });
  }, []);

  const hexToRgba = (hex: string, alpha: number) => {
    if (!hex) return `rgba(226, 232, 240, ${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const lowerPrimary = subjects.filter(s => ['GRADE_1', 'GRADE_2', 'GRADE_3'].includes(s.grade));
  const middleSchool = subjects.filter(s => ['GRADE_4', 'GRADE_5', 'GRADE_6'].includes(s.grade));
  const juniorSchool = subjects.filter(s => ['GRADE_7', 'GRADE_8', 'GRADE_9'].includes(s.grade));

  const renderSubjectGrid = (title: string, subGroup: any[]) => {
    if (subGroup.length === 0) return null;
    return (
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-2">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <span className="text-sm font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">{subGroup.length} Subjects</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subGroup.map((sub) => {
            const Icon = IconMap[sub.icon] || BookOpen;
            const color = sub.color || "#0ea5e9";
            const tintSoft = hexToRgba(color, 0.1);
            return (
              <Link href={`/dashboard/subject/${sub.id}`} key={sub.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:border-sky-300 hover:shadow-md hover:scale-[1.02] transition-all group">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tintSoft, color }}>
                  <Icon size={28} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[15px] text-slate-800 group-hover:text-sky-600 transition-colors truncate" title={sub.name}>{sub.name}</h3>
                  <div className="flex gap-2 items-center mt-1.5 flex-wrap">
                    <p className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{sub.grade.replace('_', ' ')}</p>
                    {sub.isOptional && <p className="text-[10px] uppercase font-black text-pink-500 tracking-wider">Optional</p>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <div className="w-full px-8 py-6 bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-[15px] font-bold text-slate-500 hover:text-sky-600 transition-colors">
              <ArrowLeft size={18} strokeWidth={2.5} /> Previous
            </button>
            <div className="h-5 w-[2px] bg-slate-200"></div>
            <Link href="/" className="flex items-center gap-2 text-[15px] font-bold text-slate-500 hover:text-sky-600 transition-colors">
              <Home size={18} strokeWidth={2.5} /> Home
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-[1200px] w-full mx-auto px-8 py-12 md:py-16">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-800 mb-4 tracking-tight">Full <span className="text-sky-600">Curriculum</span></h1>
          <p className="text-lg text-slate-600 max-w-2xl font-medium">
            Browse through all {subjects.length > 0 ? subjects.length : "available"} subjects across Grades 1 through 9. Click on any subject to explore its terms, lessons, and practice materials.
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {renderSubjectGrid("Lower Primary (Grades 1-3)", lowerPrimary)}
            {renderSubjectGrid("Middle School (Grades 4-6)", middleSchool)}
            {renderSubjectGrid("Junior School (Grades 7-9)", juniorSchool)}
          </div>
        )}
      </div>
    </main>
  );
}
