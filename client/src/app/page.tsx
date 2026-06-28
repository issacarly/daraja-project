"use client";
// app/page.tsx — Daraja landing page
// Hero layout: headline text LEFT · big Daraja logo RIGHT (md+)
// Below hero: enhanced landing photo full-width, natural portrait crop
// Fully mobile-first throughout

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "Grades",   href: "/grades" },
  { label: "Subjects", href: "/subjects" },
  { label: "About",    href: "/about" },
];

const PORTALS = [
  {
    role: "Student Portal",  range: "Grades 4–9", icon: "🎒",
    desc: "Track your progress, take quizzes, and join live classes.",
    href: "/register?role=student", color: "#0ea5e9",
  },
  {
    role: "Guardian Portal", range: "Grades 1–3", icon: "👨‍👩‍👧",
    desc: "Monitor your child's CBC learning journey and progress reports.",
    href: "/register?role=guardian", color: "#10b981",
  },
  {
    role: "Teacher Portal",  range: "All Grades", icon: "📚",
    desc: "Host live classes, set assessments, and track your class.",
    href: "/register?role=teacher", color: "#7c3aed",
  },
];

const STATS = [
  { value: "9",    label: "Grade levels",  sub: "Complete coverage" },
  { value: "6+",   label: "CBC subjects",  sub: "Per grade level" },
  { value: "100+", label: "Quizzes",       sub: "Interactive tests" },
];

const SUBJECTS = [
  "Mathematics 📐", "English 📖", "Creative Arts 🎨",
  "Science 🔬", "Kiswahili 🌍", "Social Studies ⚙️",
];

const FEATURES = [
  {
    icon: "🇰🇪", title: "Aligned with KICD",
    desc: "Every lesson maps to official Kenya Institute of Curriculum Development strands.",
  },
  {
    icon: "📊", title: "Competency-based tracking",
    desc: "Progress shown as BE / AE / ME / EE — the real CBC scale, not percentages.",
  },
  {
    icon: "🎥", title: "Live classes with your teacher",
    desc: "Join real-time sessions hosted by your teacher, with recordings after.",
  },
  {
    icon: "📝", title: "Past papers and exam prep",
    desc: "School papers, KNEC-style mocks, and formative quizzes all in one place.",
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc", color: "#1e293b" }}>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 w-full glass border-b border-white/40">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/daraja-logo.png" alt="Daraja logo" width={36} height={24}
              className="object-contain" />
            <span className="font-black text-slate-800 text-[15px] leading-tight">
              DARAJA
              <span className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                Learning Platform
              </span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/register"
            className="hidden md:inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors shrink-0">
            Start Free
          </Link>
          <button onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 px-5 py-4 space-y-1">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className="flex h-11 items-center text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors">
                {l.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100">
              <Link href="/register"
                className="flex items-center justify-center h-11 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors">
                Start Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 pt-12 pb-4 md:pt-20 md:pb-8">

        {/* Two-column on md+: LEFT=text, RIGHT=logo */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-20 mb-10 md:mb-14">

          {/* LEFT — headline + CTAs + portals */}
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
              style={{ backgroundColor: "rgba(14,165,233,0.1)", color: "#0284c7" }}>
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              Kenya CBC Curriculum Aligned
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-black text-slate-800 leading-tight tracking-tight mb-5">
              Bridging online CBC{" "}
              <span className="text-gradient">resources</span>{" "}
              to your classroom.
            </h1>

            <p className="text-base md:text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
              Practice quizzes from your actual textbooks, track your progress,
              and master every subject from Grade 1 to Grade 9.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/register"
                className="flex items-center justify-center px-6 py-3.5 rounded-2xl text-base font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-[0.98] transition-all">
                Start Learning Free
              </Link>
              <Link href="/login"
                className="flex items-center justify-center px-6 py-3.5 rounded-2xl text-base font-bold text-slate-700 bg-white border border-slate-200 hover:border-sky-300 hover:text-sky-600 active:scale-[0.98] transition-all">
                I Have an Account
              </Link>
            </div>

            {/* Portal cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {PORTALS.map(p => (
                <Link key={p.role} href={p.href}
                  className="glass-card rounded-2xl p-3.5 flex items-start gap-2.5 hover:shadow-md transition-all">
                  <span className="text-xl shrink-0 mt-0.5">{p.icon}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-xs leading-snug">{p.role}</p>
                    <p className="text-[10px] font-semibold mb-0.5" style={{ color: p.color }}>{p.range}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed hidden sm:block">{p.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT — big Daraja logo, floats gently, same height as text block */}
          <div className="hidden md:flex items-center justify-center shrink-0 w-[280px] lg:w-[340px] xl:w-[400px]">
            <Image
              src="/daraja-logo.png"
              alt="Daraja CBC Kenya Learning Platform"
              width={400}
              height={267}
              className="w-full h-auto object-contain animate-float"
              priority
            />
          </div>
        </div>

        {/* ── LANDING PHOTO ─────────────────────────────────────────────────
            Portrait photo (kids): displayed full-width below the hero text.
            max-height clamp keeps it proportional: shorter on mobile,
            taller on desktop. object-top keeps faces in frame.
            Replace /public/landing-photo.jpg with the enhanced PNG we made.
        ─────────────────────────────────────────────────────────────────── */}
        <div
          className="relative w-full overflow-hidden rounded-3xl shadow-lg border border-white/60"
          style={{ maxHeight: "clamp(260px, 42vw, 500px)" }}
        >
          <Image
            src="/landing-photo.png"
            alt="Three Kenyan students in school uniforms, smiling together"
            width={1611}
            height={1920}
            className="w-full h-full object-cover object-top"
            priority
            quality={95}
          />
          {/* Fade bottom into page bg */}
          <div
            className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
            style={{ background: "linear-gradient(to top, #f8fafc 10%, transparent)" }}
          />
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-10 md:py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">
          Platform info
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {STATS.map((s, i) => (
            <div key={s.label}
              className={`glass-card rounded-2xl p-5 text-center ${i === 2 ? "col-span-2 sm:col-span-1" : ""}`}>
              <p className="text-3xl font-black text-slate-800 mb-1">{s.value}</p>
              <p className="text-sm font-bold text-slate-700">{s.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Subject ticker ─────────────────────────────────────────────────── */}
      <section className="py-8 overflow-hidden">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, #f8fafc, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, #f8fafc, transparent)" }} />
          <div className="flex gap-4 animate-ticker whitespace-nowrap">
            {[...SUBJECTS, ...SUBJECTS].map((s, i) => (
              <span key={i}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-slate-600 glass-card shrink-0">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-10 md:py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Why Daraja</p>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-8 max-w-md leading-tight">
          Built around how CBC actually works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="glass-card rounded-2xl p-5 flex items-start gap-4">
              <span className="text-2xl shrink-0">{f.icon}</span>
              <div>
                <p className="font-bold text-slate-800 mb-1">{f.title}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0ea5e9, #1d4ed8)" }}>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="relative z-10">
            <p className="text-white/70 text-sm font-semibold mb-2">Free for all students</p>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight">
              Start your CBC journey today
            </h2>
            <p className="text-white/80 text-sm md:text-base mb-8 max-w-md mx-auto">
              Join thousands of Kenyan learners building real skills across all 9 grade levels.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register"
                className="flex items-center justify-center px-6 py-3.5 rounded-2xl font-bold text-sky-700 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all">
                Create free account
              </Link>
              <Link href="/grades"
                className="flex items-center justify-center px-6 py-3.5 rounded-2xl font-bold text-white border-2 border-white/40 hover:border-white/70 active:scale-[0.98] transition-all">
                Browse grades
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white/60">
        <div className="max-w-6xl mx-auto px-5 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Image src="/daraja-logo.png" alt="Daraja" width={32} height={21}
                className="object-contain" />
              <span className="text-sm font-bold text-slate-700">Daraja • CBC Learning Platform</span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href}
                  className="text-xs text-slate-500 hover:text-sky-600 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-6">
            Grades 1–9 · Aligned with the Kenya Institute of Curriculum Development (KICD)
          </p>
        </div>
      </footer>
    </div>
  );
}
