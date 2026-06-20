import Link from "next/link";
import Image from "next/image";

const subjects = [
  { label: "Mathematics", color: "from-sky-500 to-blue-700" },
  { label: "Science", color: "from-blue-500 to-sky-700" },
  { label: "English", color: "from-cyan-500 to-sky-700" },
  { label: "Kiswahili", color: "from-indigo-500 to-slate-700" },
  { label: "Arts", color: "from-blue-400 to-slate-600" },
  { label: "Social Studies", color: "from-slate-500 to-blue-800" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden px-6 py-10 sm:px-10 lg:px-16">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-sky-500/20 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                <Image src="/daraja-logo.png" alt="Daraja" width={32} height={32} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Daraja</p>
                <h1 className="text-xl font-black tracking-tight text-white">Kenya CBC Learning</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
              <Link href="#subjects" className="hover:text-white">Subjects</Link>
              <Link href="/login" className="hover:text-white">Login</Link>
              <Link href="/register" className="rounded-full bg-white px-4 py-2 font-semibold text-slate-950 transition hover:bg-slate-100">Register</Link>
            </div>
          </header>

          <section className="grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-100">
                CBC aligned learning for Grades 1-9
              </div>
              <div className="space-y-5">
                <h2 className="max-w-3xl text-5xl font-black leading-tight text-white sm:text-6xl">
                  A modern home for Kenya CBC learners.
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  Daraja delivers quizzes, progress tracking, and subject practice for students, guardians, and teachers in one clean online experience.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/register" className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-slate-950 transition hover:bg-slate-100">
                  Start Learning Free
                </Link>
                <Link href="/login" className="rounded-full border border-white/20 px-8 py-4 text-lg font-semibold text-white transition hover:border-slate-100">
                  Login to Your Account
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-3xl bg-slate-900/90 p-5 text-center">
                  <p className="text-3xl font-black text-white">9</p>
                  <p className="text-sm text-slate-400">Grade Levels</p>
                </div>
                <div className="rounded-3xl bg-slate-900/90 p-5 text-center">
                  <p className="text-3xl font-black text-white">6+</p>
                  <p className="text-sm text-slate-400">CBC Subjects</p>
                </div>
                <div className="rounded-3xl bg-slate-900/90 p-5 text-center">
                  <p className="text-3xl font-black text-white">100+</p>
                  <p className="text-sm text-slate-400">Quizzes</p>
                </div>
                <div className="rounded-3xl bg-slate-900/90 p-5 text-center">
                  <p className="text-3xl font-black text-white">3</p>
                  <p className="text-sm text-slate-400">Terms Covered</p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900">
                <Image src="/landing-photo.jpg" alt="Daraja landing photo" width={700} height={520} className="h-full w-full object-cover" />
              </div>
              <div className="mt-6 space-y-4 rounded-3xl bg-slate-950/90 p-5 text-slate-300">
                <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Real Kenyan CBC support</p>
                <p className="text-white">Practice quizzes, classroom-oriented review, and subject guidance designed for primary and lower secondary learners.</p>
              </div>
            </div>
          </section>

          <section id="subjects" className="space-y-10 pb-20">
            <div className="space-y-4 text-center">
              <h3 className="text-3xl font-black text-white">Subjects covered</h3>
              <p className="mx-auto max-w-2xl text-slate-300">Daraja includes grade-aligned content for the full Kenya CBC scope from Mathematics to Creative Arts.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <div key={subject.label} className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 transition hover:-translate-y-1 hover:bg-slate-900">
                  <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${subject.color} text-lg font-bold text-white`}>
                    {subject.label[0]}
                  </div>
                  <h4 className="text-xl font-bold text-white">{subject.label}</h4>
                  <p className="mt-3 text-slate-300">Aligned to KICD curriculum and built for classroom-ready practice.</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
