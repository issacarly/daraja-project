"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getSubjectDetails } from "@/app/actions/subject";
import { 
  ArrowLeft, Home, Flame, BookOpen, Calculator, FlaskConical, Palette, Globe2, Sparkles, Trophy,
  PlayCircle, FileText, CheckCircle2, Lock, ChevronDown, ChevronUp
} from "lucide-react";
import Link from "next/link";

const IconMap: Record<string, any> = {
  Flame, BookOpen, Calculator, FlaskConical, Palette, Globe2, Sparkles, Trophy
};

export default function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [subjectData, setSubjectData] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Get user from localStorage just to pass along if needed
    const userStr = localStorage.getItem("user");
    let studentId = undefined;
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        studentId = user.id; // Or student profile ID
      } catch (e) {}
    }

    getSubjectDetails(id, studentId)
      .then(res => {
        if (res.success) {
          setSubjectData(res.subject);
          setProgress(res.progressPercentage);
          // Expand the first course by default
          if (res.subject.courses && res.subject.courses.length > 0) {
            setExpandedCourses({ [res.subject.courses[0].id]: true });
          }
        } else {
          setError(res.message);
        }
      })
      .catch(err => {
        setError("Failed to load subject details.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  const hexToRgba = (hex: string, alpha: number) => {
    if (!hex) return `rgba(226, 232, 240, ${alpha})`; // fallback slate
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      </div>
    );
  }

  if (error || !subjectData) {
    return (
      <div className="min-h-screen w-full p-8 bg-slate-50">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-6">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="p-6 bg-red-50 text-red-600 rounded-xl font-medium border border-red-200">
          {error || "Subject not found."}
        </div>
      </div>
    );
  }

  const Icon = IconMap[subjectData.icon] || BookOpen;
  const color = subjectData.color || "#0ea5e9";
  const tintSoft = hexToRgba(color, 0.1);

  return (
    <div className="min-h-screen w-full pb-20" style={{ backgroundColor: "#f8fafc" }}>
      {/* Top Navigation */}
      <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
              <ArrowLeft size={20} />
            </button>
            <div className="h-5 w-[2px] bg-slate-200 hidden sm:block"></div>
            <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-[14px] font-bold text-slate-400 hover:text-sky-600 transition-colors">
              <Home size={16} strokeWidth={2.5} /> Dashboard
            </Link>
          </div>
          <div className="font-bold text-slate-800 text-lg sm:hidden truncate px-4">{subjectData.name}</div>
          <div className="w-10"></div> {/* spacer for centering on mobile */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8 md:py-12 animate-fade-in">
        
        {/* Subject Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
          <div 
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: color, boxShadow: `0 10px 25px -5px ${hexToRgba(color, 0.4)}` }}
          >
            <Icon size={48} className="text-white" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ backgroundColor: tintSoft, color }}>
              <Sparkles size={12} />
              {subjectData.grade.replace('_', ' ')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mb-2">
              {subjectData.name}
            </h1>
            <p className="text-slate-500 font-medium">
              Master the core concepts of {subjectData.name.toLowerCase()} in accordance with the CBC curriculum.
            </p>
          </div>
        </div>

        {/* Progress Overview Card */}
        <div className="glass-card rounded-3xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 w-full">
            <h2 className="text-lg font-bold text-slate-800 mb-1">Your Progress</h2>
            <p className="text-sm text-slate-500 mb-5">You're doing great! Keep up the momentum.</p>
            
            <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%`, backgroundColor: color }}
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-xs font-bold text-slate-400">
              <span>0%</span>
              <span style={{ color }}>{progress}% Completed</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className="hidden md:flex h-20 w-[2px] bg-slate-100"></div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="text-center">
              <div className="text-2xl font-black text-slate-800">{subjectData.courses.length}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Terms</div>
            </div>
            <div className="h-10 w-[2px] bg-slate-100"></div>
            <div className="text-center">
              <div className="text-2xl font-black text-slate-800">
                {subjectData.courses.reduce((acc: number, c: any) => acc + c.lessons.length, 0)}
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Lessons</div>
            </div>
          </div>
        </div>

        {/* Courses / Terms List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BookOpen size={20} style={{ color }} />
            Curriculum Breakdown
          </h2>

          {subjectData.courses.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-500 font-medium">No courses or lessons have been added to this subject yet.</p>
            </div>
          ) : (
            subjectData.courses.map((course: any, index: number) => {
              const isExpanded = expandedCourses[course.id];
              return (
                <div 
                  key={course.id} 
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300"
                  style={{ animation: `slideUp 0.5s ease-out ${index * 0.1}s both` }}
                >
                  {/* Course Header (Clickable) */}
                  <button 
                    onClick={() => toggleCourse(course.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color }}>
                        {course.term.replace('_', ' ')}
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">{course.title}</h3>
                      {course.description && (
                        <p className="text-sm text-slate-500 mt-1">{course.description}</p>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 ml-4 border border-slate-100">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </button>

                  {/* Course Content (Expanded) */}
                  <div 
                    className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50">
                      
                      {course.lessons.length > 0 && (
                        <div className="space-y-3 mt-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">Lessons</h4>
                          {course.lessons.map((lesson: any, i: number) => (
                            <div 
                              key={lesson.id} 
                              className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${i === 0 ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-400'}`}>
                                  {lesson.videoUrl ? <PlayCircle size={20} /> : <FileText size={20} />}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">{lesson.title}</h4>
                                  <p className="text-xs text-slate-400 mt-0.5">{lesson.videoUrl ? 'Video Lesson' : 'Reading Material'}</p>
                                </div>
                              </div>
                              <div className="text-slate-300 group-hover:text-sky-500 transition-colors">
                                {i === 0 ? <CheckCircle2 size={22} className="text-emerald-500" /> : <Lock size={18} />}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {course.quizzes.length > 0 && (
                        <div className="space-y-3 mt-6">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">Assessments</h4>
                          {course.quizzes.map((quiz: any) => (
                            <div 
                              key={quiz.id} 
                              className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-amber-100 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                  <Trophy size={20} />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">{quiz.title}</h4>
                                  <p className="text-xs text-slate-400 mt-0.5">{quiz.timeLimit} mins • {quiz.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
