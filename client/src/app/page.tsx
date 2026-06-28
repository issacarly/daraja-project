"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// ─── Mobile-first landing page for Daraja CBC Learning Platform ─────────────
// Key mobile fixes applied:
//  1. Navbar  — hamburger menu on mobile, full nav on md+
//  2. Hero    — single-column stack, headline breaks on semantic boundary
//  3. Portals — single column on mobile, row on sm+
//  4. Stats   — 2-col grid on mobile, 3-col on sm+
//  5. CTAs    — full-width stacked buttons on mobile
//  6. Photo   — constrained height, object-cover
//  7. Ticker  — proper overflow-hidden mask, no bleed
//  8. Footer  — stacked on mobile, row on md+

const NAV_LINKS = [
  { label: "Home",     href: "/"        },
  { label: "Grades",   href: "/grades"  },
  { label: "Subjects", href: "/subjects"},
  { label: "About",    href: "/about"   },
];

const PORTALS = [
  {
    role:  "Student Portal",
    range: "Grades 4–9",
    icon:  "🎒",
    desc:  "Track your progress, take quizzes, and join live classes.",
    href:  "/register?role=student",
    color: "#0ea5e9",
    bg:    "rgba(14,165,233,0.08)",
  },
  {
    role:  "Guardian Portal",
    range: "Grades 1–3",
    icon:  "👨‍👩‍👧",
    desc:  "Monitor your child's learning journey and CBC progress.",
    href:  "/register?role=guardian",
    color: "#10b981",
    bg:    "rgba(16,185,129,0.08)",
  },
  {
    role:  "Teacher Portal",
    range: "All Grades",
    icon:  "📚",
    desc:  "Host live classes, set assessments, and track your class.",
    href:  "/register?role=teacher",
    color: "#7c3aed",
    bg:    "rgba(124,58,237,0.08)",
  },
];

const STATS = [
  { value: "9",    label: "Grade levels",     sub: "Complete coverage" },
  { value: "6+",   label: "CBC subjects",     sub: "Per grade level"   },
  { value: "100+", label: "Quizzes",          sub: "Interactive tests" },
];

const SUBJECTS = [
  "Mathematics 📐", "English 📖", "Creative Arts 🎨",
  "Science 🔬", "Kiswahili 🌍", "Social Studies ⚙️",
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc", color: "#1e293b" }}>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 w-full glass border-b border-white/40">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/daraja-logo.png" alt="Daraja logo" width={36} height={36} className="rounded-lg" />
            <span className="font-black text-slate-800 text-base leading-tight">
              DARAJA<br />
              <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">Learning Platform</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}
                className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link href="/register"
            className="hidden md:inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors shrink-0">
            Start Free
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 px-5 py-4 space-y-1">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center h-11 text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors">
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

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 pt-12 pb-8 md:pt-20 md:pb-16">

        {/* Kenya CBC badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
          style={{ backgroundColor: "rgba(14,165,233,0.1)", color: "#0284c7" }}>
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          Kenya CBC Curriculum Aligned
        </div>

        {/* Headline — breaks at semantic boundary on all sizes */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 leading-tight tracking-tight mb-5 max-w-3xl">
          Bridging online CBC{" "}
          <span className="text-gradient">resources</span>{" "}
          to your classroom.
        </h1>

        <p className="text-base md:text-lg text-slate-500 leading-relaxed mb-8 max-w-xl">
          Practice quizzes from your actual textbooks, track progress,
          and master every subject from Grade 1 to Grade 9.
        </p>

        {/* CTAs — stacked on mobile, side-by-side on sm+ */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10 sm:mb-12">
          <Link href="/register"
            className="flex items-center justify-center px-6 py-3.5 rounded-2xl text-base font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-[0.98] transition-all text-center">
            Start Learning Free
          </Link>
          <Link href="/login"
            className="flex items-center justify-center px-6 py-3.5 rounded-2xl text-base font-bold text-slate-700 bg-white border border-slate-200 hover:border-sky-300 hover:text-sky-600 active:scale-[0.98] transition-all text-center">
            I Have an Account
          </Link>
        </div>

        {/* Portal cards — single column on mobile, 3-col on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {PORTALS.map((p) => (
            <Link key={p.role} href={p.href}
              className="glass-card rounded-2xl p-4 flex items-start gap-3 group hover:shadow-md transition-all">
              <span className="text-2xl shrink-0 mt-0.5">{p.icon}</span>
              <div className="min-w-0">
                <p className="font-bold text-slate-800 text-sm leading-snug">{p.role}</p>
                <p className="text-[11px] font-semibold mb-1.5" style={{ color: p.color }}>{p.range}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Hero photo — constrained, object-cover */}
        <div className="relative w-full rounded-3xl overflow-hidden"
          style={{ height: "clamp(200px, 40vw, 420px)" }}>
          <Image
            src="/landing-photo.jpg"
            alt="Kenyan students learning with Daraja"
            fill
            className="object-cover object-top"
            priority
          />
          {/* Subtle gradient overlay at bottom so it blends into the next section */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-10 md:py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">Platform info</p>

        {/* 2-col on mobile (3rd item full-width), 3-col on sm+ */}
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
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, #f8fafc, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, #f8fafc, transparent)" }} />

          {/* Ticker track */}
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

      {/* ── Why Daraja ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-10 md:py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Why Daraja</p>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-8 max-w-md leading-tight">
          Built around how CBC actually works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Aligned with KICD",
              desc: "Every lesson and quiz maps to the official Kenya Institute of Curriculum Development strands.",
              icon: "🇰🇪",
            },
            {
              title: "Competency-based tracking",
              desc: "Progress shown as BE / AE / ME / EE — the real CBC assessment scale, not percentages.",
              icon: "📊",
            },
            {
              title: "Live classes with your teacher",
              desc: "Join real-time sessions hosted by your school's teacher, with recordings available after.",
              icon: "🎥",
            },
            {
              title: "Past papers & exam prep",
              desc: "School papers, KNEC-style mocks, and formative quizzes all in one place.",
              icon: "📝",
            },
          ].map((f) => (
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

      {/* ── Final CTA banner ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0ea5e9, #1d4ed8)" }}>
          {/* Decorative circles */}
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
          {/* Stack on mobile, row on md+ */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Image src="/daraja-logo.png" alt="Daraja" width={28} height={28} className="rounded-md" />
              <span className="text-sm font-bold text-slate-700">Daraja • CBC Learning Platform</span>
            </div>

            {/* Footer nav — wraps naturally on mobile */}
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href}
                  className="text-xs text-slate-500 hover:text-sky-600 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-6 leading-relaxed">
            Grades 1–9 · Aligned with the Kenya Institute of Curriculum Development (KICD)
          </p>
        </div>
      </footer>
    </div>
  );
}
