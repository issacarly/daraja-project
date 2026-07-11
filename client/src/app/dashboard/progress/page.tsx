"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Trophy, BookOpen, Flame, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";
import { getAllSubjects } from "@/app/actions/subject";
import { buildSubjectContent } from "@/lib/subject-mock-data";

export default function ProgressPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [userGrade, setUserGrade] = useState<string>("GRADE_5");
  const [isLoading, setIsLoading] = useState(true);

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
      if (res.success && res.subjects) {
        const gradeMetas = res.subjects.filter((s: any) => s.grade === dbGrade);
        
        const list = gradeMetas.map((meta: any) => {
          return buildSubjectContent(meta);
        });
        setSubjects(list);
      }
      setIsLoading(false);
    });
  }, []);

  const totalLessons = subjects.reduce((sum: number, s: any) => sum + s.terms.reduce((ts: number, t: any) => ts + t.lessons.length, 0), 0);
  const completedLessons = subjects.reduce((sum: number, s: any) => sum + s.terms.reduce((ts: number, t: any) => ts + t.lessons.filter((l: any) => l.isCompleted).length, 0), 0);
  
  const overallPercentage = totalLessons > 0 
    ? Math.round((completedLessons / totalLessons) * 100) 
    : 0;

  // Derive counts for mock levels
  const eeCount = subjects.filter((s: any, idx: number) => idx % 4 === 0).length || 1;
  const meCount = subjects.filter((s: any, idx: number) => idx % 4 === 1 || idx % 4 === 2).length || Math.max(subjects.length - 2, 0);
  const aeCount = subjects.filter((s: any, idx: number) => idx % 4 === 3).length || 0;

  return (
    <div className="w-full min-h-screen bg-slate-50">
      {/* Top Header */}
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

      <div className="max-w-5xl mx-auto px-8 py-12 md:py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">
            Learning <span className="text-sky-600">Progress</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Overall competency levels, lesson completions, and statistics for {userGrade.replace('_', ' ')}
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Stat Summary Grid */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-800">{overallPercentage}%</p>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-0.5">Average Progress</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-800">{completedLessons} / {totalLessons}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-0.5">Lessons Completed</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <Flame size={24} fill="#f59e0b" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-800">12 days</p>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-0.5">Learning Streak</p>
                </div>
              </div>
            </div>

            {/* Competency Level Distribution */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" />
                Competency Distribution
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Exceeding Expectation (EE)", count: eeCount, color: "bg-green-500", percent: Math.round((eeCount / Math.max(subjects.length, 1)) * 100) },
                  { label: "Meeting Expectation (ME)", count: meCount, color: "bg-sky-500", percent: Math.round((meCount / Math.max(subjects.length, 1)) * 100) },
                  { label: "Approaching Expectation (AE)", count: aeCount, color: "bg-amber-500", percent: Math.round((aeCount / Math.max(subjects.length, 1)) * 100) },
                  { label: "Below Expectation (BE)", count: 0, color: "bg-red-500", percent: 0 }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>{item.label}</span>
                      <span>{item.count} {item.count === 1 ? 'subject' : 'subjects'} ({item.percent}%)</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject Specific Progress bars */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BookOpen size={18} className="text-sky-600" />
                Progress by Subject
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {subjects.map((sub, idx) => {
                  const subjectLessons = sub.terms.reduce((sum: number, t: any) => sum + t.lessons.length, 0);
                  const completed = sub.terms.reduce((sum: number, t: any) => sum + t.lessons.filter((l: any) => l.isCompleted).length, 0);
                  const pct = subjectLessons > 0 ? Math.round((completed / subjectLessons) * 100) : 0;
                  
                  return (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-slate-800 text-sm">{sub.name}</h3>
                          <span className="text-xs font-bold" style={{ color: sub.color }}>
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: sub.color }} />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 font-bold uppercase">
                        {completed} of {subjectLessons} lessons completed
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
