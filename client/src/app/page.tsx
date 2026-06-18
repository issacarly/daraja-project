import Link from "next/link";

const subjects = [
  { icon: "🔢", name: "Mathematics", color: "from-blue-500 to-blue-700" },
  { icon: "🔬", name: "Science", color: "from-purple-500 to-purple-700" },
  { icon: "📖", name: "English", color: "from-orange-500 to-orange-700" },
  { icon: "🌍", name: "Kiswahili", color: "from-red-500 to-red-700" },
  { icon: "🎨", name: "Creative Arts", color: "from-pink-500 to-pink-700" },
  { icon: "⚙️", name: "Social Studies", color: "from-teal-500 to-teal-700" },
];

const stats = [
  { number: "9", label: "Grade Levels" },
  { number: "6+", label: "CBC Subjects" },
  { number: "100+", label: "Quizzes" },
  { number: "3", label: "Terms Covered" },
];

export default function Home() {
  return (
    <main
      className="min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #14532d 0%, #166534 25%, #15803d 50%, #16a34a 75%, #ca8a04 100%)",
      }}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #facc15, transparent)" }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #ffffff, transparent)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, #facc15, transparent)",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-float">🌉</span>
            <span className="text-white font-black text-2xl tracking-tight">Daraja</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <button className="text-white border border-white border-opacity-40 px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:bg-opacity-10 transition-all">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-yellow-400 text-green-900 px-5 py-2 rounded-full text-sm font-bold hover:bg-yellow-300 transition-all animate-pulse-glow">
                Get Started
              </button>
            </Link>
          </div>
        </nav>

        <section className="text-center px-4 py-20 max-w-5xl mx-auto animate-fade-in-up">
          <div className="inline-block glass px-4 py-2 rounded-full text-yellow-300 text-sm font-medium mb-6">
            🇰🇪 Kenya CBC Curriculum • Grade 1 – 9
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Learn Smarter with <span className="gradient-text">Daraja</span>
          </h1>
          <p className="text-green-100 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Bridging online CBC resources to your physical classroom. Practice quizzes from your actual textbooks, track progress, and master every subject — Grade 1 to Grade 9.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="bg-yellow-400 text-green-900 font-black px-10 py-4 rounded-full text-lg shadow-2xl hover:bg-yellow-300 hover:scale-105 transition-all animate-pulse-glow">
                Start Learning Free 🚀
              </button>
            </Link>
            <Link href="/login">
              <button className="glass text-white font-bold px-10 py-4 rounded-full text-lg hover:bg-white hover:bg-opacity-20 transition-all">
                I Have an Account
              </button>
            </Link>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`glass rounded-2xl p-6 text-center animate-fade-in-up delay-${(i + 1) * 100}`}>
                <div className="text-4xl font-black text-yellow-400 mb-1">{stat.number}</div>
                <div className="text-green-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 mb-20">
          <h2 className="text-white text-3xl font-black text-center mb-4">All CBC Subjects Covered</h2>
          <p className="text-green-200 text-center mb-10">
            From Mathematics to Creative Arts — we have it all
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {subjects.map((subject, i) => (
              <div
                key={subject.name}
                className={`glass rounded-2xl p-6 flex items-center gap-4 hover:scale-105 transition-all cursor-pointer animate-fade-in-up delay-${(i + 1) * 100}`}>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {subject.icon}
                </div>
                <span className="text-white font-bold">{subject.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 mb-20">
          <h2 className="text-white text-3xl font-black text-center mb-10">Built for Everyone</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "👦",
                title: "Students",
                grades: "Grade 4 – 9",
                desc: "Access lessons, take quizzes matching your textbooks, and track your scores and progress.",
                color: "from-blue-500 to-blue-700",
                href: "/register?role=student",
              },
              {
                icon: "👨‍👩‍👧",
                title: "Guardians",
                grades: "For Grade 1 – 3",
                desc: "Register your child, monitor their learning journey and quiz performance daily.",
                color: "from-green-500 to-green-700",
                href: "/register?role=guardian",
              },
              {
                icon: "👩‍🏫",
                title: "Teachers",
                grades: "All Grades",
                desc: "Create quizzes, assign content to students, and view detailed class performance reports.",
                color: "from-purple-500 to-purple-700",
                href: "/register?role=teacher",
              },
            ].map((card, i) => (
              <Link href={card.href} key={card.title}>
                <div className={`glass rounded-3xl p-8 text-center hover:scale-105 transition-all cursor-pointer animate-fade-in-up delay-${(i + 1) * 200} group`}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg group-hover:scale-110 transition-all`}>
                    {card.icon}
                  </div>
                  <div className="inline-block bg-yellow-400 bg-opacity-20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
                    {card.grades}
                  </div>
                  <h3 className="text-white font-black text-xl mb-3">{card.title}</h3>
                  <p className="text-green-100 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 mb-20">
          <div className="glass rounded-3xl p-12 text-center">
            <h2 className="text-white text-4xl font-black mb-4">Ready to Bridge the Gap? 🌉</h2>
            <p className="text-green-100 text-lg mb-8">
              Join thousands of Kenyan students already learning smarter with Daraja
            </p>
            <Link href="/register">
              <button className="bg-yellow-400 text-green-900 font-black px-12 py-4 rounded-full text-xl hover:bg-yellow-300 hover:scale-105 transition-all animate-pulse-glow shadow-2xl">
                Join Daraja Today — It's Free!
              </button>
            </Link>
          </div>
        </section>

        <footer className="text-center py-8 text-green-300 text-sm border-t border-white border-opacity-10">
          <p>🌉 Daraja • Kenya CBC Learning Platform • Grades 1–9</p>
          <p className="mt-1 text-green-400">Aligned with the Kenya Institute of Curriculum Development (KICD)</p>
        </footer>
      </div>
    </main>
  );
}
