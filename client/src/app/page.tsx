import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, User, Users, GraduationCap, ChevronDown, Sparkles, BookOpen, Star } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans relative overflow-x-hidden flex flex-col selection:bg-sky-200 selection:text-sky-900">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] rounded-full bg-sky-200/50 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60%] rounded-full bg-amber-100/40 blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-slate-200/50 blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1s' }} />

      {/* Decorative Floating Objects */}
      <div className="absolute top-[30%] left-[5%] text-amber-400 opacity-60 animate-float" style={{ animationDelay: '0.5s' }}>
        <Star size={48} fill="currentColor" />
      </div>
      <div className="absolute top-[60%] left-[45%] text-sky-400 opacity-40 animate-float" style={{ animationDelay: '1.5s' }}>
        <BookOpen size={56} />
      </div>
      <div className="absolute top-[15%] right-[35%] w-16 h-16 rounded-full border-4 border-sky-300 opacity-50 animate-float" style={{ animationDelay: '2.5s' }}></div>
      <div className="absolute bottom-[25%] left-[2%] w-10 h-10 bg-amber-300 rounded-lg rotate-12 opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>

      {/* Floating Navbar */}
      <div className="w-full px-8 pt-8 pb-2 sticky top-0 z-50 animate-fade-in">
        <nav className="glass mx-auto max-w-[1500px] rounded-[2.5rem] px-10 py-5 flex items-center justify-between transition-all duration-300 shadow-xl shadow-slate-200/50 border border-white/80">
          
          {/* Logo Area (Made significantly larger per request) */}
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-slate-100 bg-white shadow-md">
              <Image src="/daraja-logo.png" alt="Daraja Logo" width={64} height={64} className="h-16 w-16 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-[2.75rem] font-black tracking-widest text-slate-800 leading-none drop-shadow-sm">DARAJA</span>
              <span className="text-[14px] font-bold text-sky-600 tracking-[0.2em] uppercase mt-1">Learning Platform</span>
            </div>
          </div>
          
          {/* Center Links */}
          <div className="hidden lg:flex items-center gap-12 text-[17px] font-bold text-slate-600">
            <Link href="#" className="text-sky-600 relative after:absolute after:bottom-[-6px] after:left-0 after:h-[3px] after:w-full after:bg-sky-500 after:rounded-full transition-colors">Home</Link>
            <Link href="#" className="hover:text-sky-600 transition-colors">Grades</Link>
            <Link href="#" className="hover:text-sky-600 transition-colors">Subjects</Link>
            <Link href="#" className="hover:text-sky-600 transition-colors">About Us</Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <button className="text-slate-500 hover:text-sky-600 transition-colors"><Search size={26} strokeWidth={2.5} /></button>
            <button className="text-slate-500 hover:text-sky-600 transition-colors"><ShoppingCart size={26} strokeWidth={2.5} /></button>
            <div className="h-8 w-[2px] bg-slate-200 mx-2"></div>
            <Link href="/login" className="text-[16px] font-bold text-slate-600 hover:text-sky-600 transition-colors hidden sm:block">
              Login
            </Link>
            <Link href="/register" className="flex items-center gap-2 rounded-full bg-sky-600 px-8 py-3.5 text-[16px] font-bold text-white shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-105 transition-all duration-300">
              Start Free <Sparkles size={18} className="text-amber-200" />
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Section - STRICT 2-COLUMN LAYOUT */}
      <section className="flex-1 w-full mx-auto max-w-[1500px] px-8 pt-12 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10 items-center">
        
        {/* Left Column (Text & Buttons) */}
        <div className="space-y-8 animate-slide-up justify-self-start text-left w-full">
          
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/90 border border-slate-200 shadow-sm text-sm font-bold text-slate-600 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            Kenya CBC Curriculum Aligned
          </div>

          <h1 className="text-[3.5rem] xl:text-[4.8rem] font-black leading-[1.05] text-slate-800 tracking-tight">
            Bridging online CBC<br />
            resources to your <br />
            <span className="text-gradient block mt-2">physical classroom.</span>
          </h1>
          
          <p className="text-[1.35rem] text-slate-600 font-medium max-w-[38rem] leading-relaxed">
            Practice quizzes from your actual textbooks, track progress, and master every subject from Grade 1 to Grade 9.
          </p>

          {/* Buttons Group (Fixed identical sizing without overlapping) */}
          <div className="flex flex-col sm:flex-row items-center justify-start gap-5 pt-2">
            <Link href="/register" className="flex w-[260px] h-[60px] items-center justify-center gap-2 rounded-full bg-slate-800 text-[17px] font-bold text-white shadow-xl shadow-slate-800/20 hover:bg-slate-700 hover:scale-[1.03] transition-all duration-300">
              Start Learning Free <Sparkles size={18} className="text-amber-300" />
            </Link>
            <Link href="/login" className="flex w-[260px] h-[60px] items-center justify-center rounded-full bg-white text-[17px] font-bold text-slate-700 border-2 border-slate-200 shadow-sm hover:border-sky-300 hover:bg-sky-50 hover:scale-[1.03] transition-all duration-300">
              I Have an Account
            </Link>
          </div>

          {/* Floating Portal Cards */}
          <div className="pt-10 grid grid-cols-3 gap-6 max-w-[650px]">
            <div className="glass-card flex flex-col items-center justify-center text-center p-6 rounded-[2rem] animate-float relative overflow-hidden group">
              <div className="absolute inset-0 bg-sky-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center mb-4 text-sky-600 group-hover:bg-white group-hover:shadow-sm transition-colors duration-300">
                <User size={28} strokeWidth={2.5} />
              </div>
              <p className="text-[16px] font-bold text-slate-800">Student Portal</p>
              <p className="text-[13px] font-medium text-slate-500 mt-1">Grades 4-9</p>
            </div>
            
            <div className="glass-card flex flex-col items-center justify-center text-center p-6 rounded-[2rem] animate-float relative overflow-hidden group" style={{ animationDelay: '1s' }}>
              <div className="absolute inset-0 bg-amber-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4 text-amber-600 group-hover:bg-white group-hover:shadow-sm transition-colors duration-300">
                <Users size={28} strokeWidth={2.5} />
              </div>
              <p className="text-[16px] font-bold text-slate-800">Guardian Portal</p>
              <p className="text-[13px] font-medium text-slate-500 mt-1">Grades 1-3</p>
            </div>
            
            <div className="glass-card flex flex-col items-center justify-center text-center p-6 rounded-[2rem] animate-float relative overflow-hidden group" style={{ animationDelay: '2s' }}>
              <div className="absolute inset-0 bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-600 group-hover:bg-white group-hover:shadow-sm transition-colors duration-300">
                <GraduationCap size={28} strokeWidth={2.5} />
              </div>
              <p className="text-[16px] font-bold text-slate-800">Teacher Portal</p>
              <p className="text-[13px] font-medium text-slate-500 mt-1">All Grades</p>
            </div>
          </div>
        </div>

        {/* Right Column (Image + Dashboard Layout) */}
        <div className="relative animate-slide-up justify-self-end w-full max-w-[650px] h-[600px] flex items-center justify-center" style={{ animationDelay: '0.2s' }}>
          
          {/* Blended Image Container (No rigid borders, blends into background) */}
          <div className="relative w-full h-full z-10 mix-blend-multiply">
            <Image 
              src="/landing-photo.jpg" 
              alt="Kenyan Students"
              fill
              className="object-contain object-center xl:object-right drop-shadow-2xl"
              priority
            />
          </div>

          {/* Glowing Accent behind image to highlight the transparent effect */}
          <div className="absolute top-1/4 right-[10%] w-[80%] h-[60%] rounded-full bg-gradient-to-br from-sky-400 to-amber-300 blur-[80px] opacity-30 -z-10 animate-pulse-glow" />

          {/* Floating Stats Dashboard (Overlapping image) */}
          <div className="glass absolute -left-[10%] top-[60%] -translate-y-1/2 rounded-[2.5rem] p-6 flex flex-col gap-6 z-20 shadow-2xl shadow-slate-800/10 border-[1.5px] border-white/80 animate-float-delayed bg-white/70">
            
            <div className="flex items-center gap-3 text-slate-800 font-black text-[1.2rem] mb-1 border-b-2 border-slate-200 pb-3">
              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                <ChevronDown size={18} strokeWidth={3} className="text-sky-600" />
              </div>
              Platform Info
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl font-black text-slate-800 border border-slate-100">9</div>
              <div>
                <p className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">Grade Levels</p>
                <p className="text-[15px] font-bold text-slate-800 mt-0.5">Complete Coverage</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl font-black text-sky-600 border border-slate-100">6+</div>
              <div>
                <p className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">CBC Subjects</p>
                <p className="text-[15px] font-bold text-slate-800 mt-0.5">Per Grade Level</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl font-black text-amber-500 border border-slate-100">100+</div>
              <div>
                <p className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">Quizzes</p>
                <p className="text-[15px] font-bold text-slate-800 mt-0.5">Interactive Tests</p>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Bottom Subjects Bar */}
      <div className="w-full bg-white/70 backdrop-blur-xl border-t-2 border-slate-200 py-6 relative mt-auto z-20">
        <div className="max-w-[1500px] mx-auto px-10 flex items-center justify-center flex-wrap gap-y-4 text-[1.2rem] font-bold text-slate-600 tracking-wider">
          <span className="flex items-center gap-2.5 mx-5 hover:text-sky-600 transition-colors cursor-pointer hover:scale-105 duration-200">Mathematics 📐</span> <span className="text-slate-300 font-light hidden sm:inline">|</span>
          <span className="flex items-center gap-2.5 mx-5 hover:text-sky-600 transition-colors cursor-pointer hover:scale-105 duration-200">English 📖</span> <span className="text-slate-300 font-light hidden sm:inline">|</span>
          <span className="flex items-center gap-2.5 mx-5 hover:text-sky-600 transition-colors cursor-pointer hover:scale-105 duration-200">Creative Arts 🎨</span> <span className="text-slate-300 font-light hidden lg:inline">|</span>
          <span className="flex items-center gap-2.5 mx-5 hover:text-sky-600 transition-colors cursor-pointer hover:scale-105 duration-200">Science 🔬</span> <span className="text-slate-300 font-light hidden sm:inline">|</span>
          <span className="flex items-center gap-2.5 mx-5 hover:text-sky-600 transition-colors cursor-pointer hover:scale-105 duration-200">Kiswahili 🌍</span> <span className="text-slate-300 font-light hidden sm:inline">|</span>
          <span className="flex items-center gap-2.5 mx-5 hover:text-sky-600 transition-colors cursor-pointer hover:scale-105 duration-200">Social Studies ⚙️</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-slate-900 py-5 text-center text-[14px] text-slate-400 tracking-wider font-semibold z-20">
        Daraja • Kenya CBC Learning Platform • Grades 1–9 • Aligned with the Kenya Institute of Curriculum Development (KICD)
      </footer>
      
    </main>
  );
}
