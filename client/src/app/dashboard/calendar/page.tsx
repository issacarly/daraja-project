"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Calendar, Video, Clock, User, Check, Play } from "lucide-react";
import { getAllSubjects } from "@/app/actions/subject";
import { buildSubjectContent } from "@/lib/subject-mock-data";

export default function CalendarPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
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
            termBlock.liveClasses.forEach((lc: any) => {
              list.push({
                ...lc,
                subjectColor: subject.color,
                subjectName: subject.name,
                termLabel: termBlock.term.replace('_', ' ')
              });
            });
          });
        });
        
        // Sort by date: upcoming first, then past
        list.sort((a, b) => new Date(a.scheduledAt || "").getTime() - new Date(b.scheduledAt || "").getTime());
        setEvents(list);
      }
      setIsLoading(false);
    });
  }, []);

  const upcoming = events.filter(e => e.status === "SCHEDULED");
  const completed = events.filter(e => e.status === "ENDED");

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-KE", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
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

      <div className="max-w-4xl mx-auto px-8 py-12 md:py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">
            Class <span className="text-sky-600">Calendar</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Join live classroom sessions with your teachers and watch past recordings for {userGrade.replace('_', ' ')}
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Upcoming Live Classes */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Video size={20} className="text-sky-500 animate-pulse" />
                Upcoming Live Sessions ({upcoming.length})
              </h2>
              {upcoming.length > 0 ? (
                <div className="space-y-4">
                  {upcoming.map((ev) => (
                    <div key={`${ev.subjectName}-${ev.id}`} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: ev.subjectColor }}>
                            {ev.subjectName}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                            {ev.termLabel}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg mb-2">{ev.title}</h3>
                        <p className="text-sm text-slate-500 mb-4">{ev.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {formatDate(ev.scheduledAt)} ({ev.durationMinutes} min)
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {ev.teacherName}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center shrink-0">
                        <a 
                          href={ev.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-full transition-colors flex items-center gap-2 shadow-sm shadow-sky-600/30"
                        >
                          <Video size={16} />
                          Join Class
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-400">
                  No upcoming live classes scheduled this week.
                </div>
              )}
            </div>

            {/* Completed Sessions & Recordings */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Check size={20} className="text-green-500" />
                Past Sessions &amp; Recordings ({completed.length})
              </h2>
              {completed.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {completed.map((ev) => (
                    <div key={`${ev.subjectName}-${ev.id}`} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${ev.subjectColor}15`, color: ev.subjectColor }}>
                            {ev.subjectName}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">{ev.termLabel}</span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-base mb-1">{ev.title}</h3>
                        <p className="text-xs text-slate-400 font-semibold mb-2">Teacher: {ev.teacherName}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">
                          {ev.attendees} attended · Completed
                        </span>
                        <a 
                          href={ev.recordingUrl || "#"}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-sky-600 font-bold text-xs rounded-full transition-colors flex items-center gap-1.5"
                        >
                          <Play size={12} fill="currentColor" />
                          Recording
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-slate-400">
                  No past sessions recorded.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
