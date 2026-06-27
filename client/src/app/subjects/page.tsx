"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, BookOpen, Calculator, Globe2, Palette, FlaskConical, Flame } from "lucide-react";

export default function SubjectsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <div className="w-full px-8 py-6 bg-white shadow-sm border-b border-slate-200">
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

      <div className="flex-1 max-w-[1200px] w-full mx-auto px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Curriculum <span className="text-sky-600">Subjects</span></h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Our platform covers all CBC learning areas. Here is a sample of the subjects available for practice.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Mathematics", icon: Calculator, color: "text-amber-500", bg: "bg-amber-50" },
            { name: "English", icon: Globe2, color: "text-violet-600", bg: "bg-violet-50" },
            { name: "Kiswahili", icon: BookOpen, color: "text-rose-600", bg: "bg-rose-50" },
            { name: "Science & Tech", icon: FlaskConical, color: "text-teal-600", bg: "bg-teal-50" },
            { name: "Creative Arts", icon: Palette, color: "text-sky-500", bg: "bg-sky-50" },
            { name: "Health Education", icon: Flame, color: "text-red-500", bg: "bg-red-50" }
          ].map((sub, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:border-sky-200 hover:shadow-md transition-all cursor-default">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${sub.bg} ${sub.color}`}>
                <sub.icon size={28} strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">{sub.name}</h3>
                <p className="text-sm text-slate-500 mt-1">Interactive quizzes & materials</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
