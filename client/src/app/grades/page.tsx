"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Sparkles } from "lucide-react";

export default function GradesPage() {
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
          <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Grade Levels <span className="text-sky-600">Overview</span></h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Explore the different grade levels covered by our platform, mapped perfectly to the CBC curriculum.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Lower Primary</h2>
            <p className="text-sky-600 font-semibold mb-4">Grades 1, 2, 3</p>
            <p className="text-slate-600">Foundation building with core subjects like Math, English, Kiswahili, and Creative Activities.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Middle School</h2>
            <p className="text-amber-500 font-semibold mb-4">Grades 4, 5, 6</p>
            <p className="text-slate-600">Expanding knowledge with Science & Technology, Agriculture, and Social Studies.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500">
              <Sparkles size={100} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Junior School</h2>
            <p className="text-emerald-500 font-semibold mb-4">Grades 7, 8, 9</p>
            <p className="text-slate-600 relative z-10">Advanced subjects including Pre-Technical Studies, Business Studies, and optional choices like Computer Science.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
