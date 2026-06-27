"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Heart, Users, Target } from "lucide-react";

export default function AboutPage() {
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
        <div className="max-w-3xl">
          <h1 className="text-4xl font-black text-slate-800 mb-6 tracking-tight">About <span className="text-sky-600">Daraja</span></h1>
          <p className="text-lg text-slate-600 mb-12 leading-relaxed">
            Daraja is a modern learning platform designed specifically for the Kenyan Competency-Based Curriculum (CBC). Our mission is to bridge the gap between classroom learning and digital reinforcement by providing high-quality, accessible educational materials for students, teachers, and guardians alike.
          </p>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 shrink-0 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                <Target size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Our Mission</h3>
                <p className="text-slate-600">To provide every student with the tools they need to master the CBC curriculum, regardless of their background or location.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 shrink-0 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">For the Community</h3>
                <p className="text-slate-600">We empower teachers with robust tracking tools and give guardians full visibility into their child's academic progress.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 shrink-0 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Built with Love</h3>
                <p className="text-slate-600">Designed and developed with input from local educators to ensure an authentic and effective learning experience.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
