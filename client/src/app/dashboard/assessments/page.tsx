"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, ClipboardList, CheckCircle2, Lock, Clock, Trophy } from "lucide-react";
import { getAllSubjects } from "@/app/actions/subject";
import { buildSubjectContent } from "@/lib/subject-mock-data";

export default function AssessmentsPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<any[]>([]);
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
        
        const list: any[] = [];
        gradeMetas.forEach((meta: any) => {
          const subject = buildSubjectContent(meta);
          subject.terms.forEach((termBlock: any) => {
            termBlock.assessments.forEach((ass: any) => {
              list.push({
                ...ass,
                subjectName: subject.name,
                subjectColor: subject.color,
                subjectIcon: subject.icon,
                termLabel: termBlock.term.replace('_', ' ')
              });
            });
          });
        });
        setAssessments(list);
      }
      setIsLoading(false);
    });
  }, []);

  const pending = assessments.filter(a => !a.isSubmitted && a.isAvailable);
  const completed = assessments.filter(a => a.isSubmitted);
  const upcoming = assessments.filter(a => !a.isSubmitted && !a.isAvailable);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "FORMATIVE_QUIZ": return "Quiz";
      case "MID_TERM_TEST": return "Mid-Term";
      case "END_TERM_EXAM": return "End-Term Exam";
      default: return "Assessment";
    }
  };

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
            My <span className="text-sky-600">Assessments</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Review your quizzes, tests, and CBA components for {userGrade.replace('_', ' ')}
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Pending Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-amber-500" />
                Active Assessments ({pending.length})
              </h2>
              {pending.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {pending.map((ass) => (
                    <div key={`${ass.subjectName}-${ass.id}`} className="glass-card bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${ass.subjectColor}15`, color: ass.subjectColor }}>
                            {ass.subjectName}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">{ass.termLabel}</span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-base mb-1">{ass.title}</h3>
                        <p className="text-xs text-slate-400 uppercase font-black tracking-wider mb-2 text-sky-600">
                          {getTypeLabel(ass.type)}
                        </p>
                        <p className="text-sm text-slate-500 mb-4">{ass.description || "Take this assessment to build your portfolio."}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-400 font-medium">
                          {ass.timeLimitMinutes ? `${ass.timeLimitMinutes} mins` : "No limit"} · {ass.totalMarks} marks
                        </span>
                        <button className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-full transition-colors">
                          Start Assessment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-slate-400">
                  No active assessments to take right now. Good job!
                </div>
              )}
            </div>

            {/* Completed Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-green-500" />
                Completed &amp; Scores ({completed.length})
              </h2>
              {completed.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {completed.map((ass) => (
                    <div key={`${ass.subjectName}-${ass.id}`} className="glass-card bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between opacity-95">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${ass.subjectColor}15`, color: ass.subjectColor }}>
                            {ass.subjectName}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">{ass.termLabel}</span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-base mb-1">{ass.title}</h3>
                        <p className="text-xs text-slate-400 uppercase font-black tracking-wider mb-3 text-green-600">
                          {getTypeLabel(ass.type)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 bg-slate-50/50 p-3 rounded-xl">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Your Score</p>
                          <p className="text-base font-black text-slate-800">
                            {ass.score} / {ass.totalMarks}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">CBA Band</p>
                          <span className="inline-block text-xs font-bold px-2 py-0.5 rounded text-white mt-0.5" style={{ backgroundColor: ass.subjectColor }}>
                            {ass.competencyLevel === "EE" ? "Exceeding Expectation" : ass.competencyLevel === "ME" ? "Meeting Expectation" : ass.competencyLevel === "AE" ? "Approaching Expectation" : "Below Expectation"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-slate-400">
                  No completed assessments yet.
                </div>
              )}
            </div>

            {/* Upcoming / Locked Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Lock size={20} className="text-slate-400" />
                Locked / Future Terms ({upcoming.length})
              </h2>
              {upcoming.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4 opacity-75">
                  {upcoming.map((ass) => (
                    <div key={`${ass.subjectName}-${ass.id}`} className="glass-card bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-400">
                            {ass.subjectName}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">{ass.termLabel}</span>
                        </div>
                        <h3 className="font-bold text-slate-400 text-base mb-1">{ass.title}</h3>
                        <p className="text-xs text-slate-400 uppercase font-black tracking-wider mb-2">
                          {getTypeLabel(ass.type)}
                        </p>
                        <p className="text-sm text-slate-400 mb-4">{ass.description || "Locked until the term starts."}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-slate-400 text-xs">
                        <span>Locked</span>
                        <Lock size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-slate-400">
                  No locked assessments.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
