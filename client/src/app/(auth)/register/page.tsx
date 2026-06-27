"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home, Mail, Lock, User, Sparkles, UserCircle2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import UICInput from "@/components/auth/UICInput";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirm: "",
    role: "STUDENT",
    grade: "Grade 5",
    institutionId: null as number | null
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        // Handle FastAPI validation errors (which are arrays) or detail messages
        if (data.detail && Array.isArray(data.detail)) {
          setError(data.detail[0].msg);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError(data.message || "Registration failed");
        }
      } else {
        // Store token and redirect
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard"); // Assuming there's a dashboard or similar
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* Right Column - Brand Panel (Reversed for variety) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-100 items-center justify-center">
        
        {/* Background Glowing Orbs */}
        <div className="absolute top-[20%] right-[20%] w-[50%] h-[50%] rounded-full bg-amber-300/30 blur-[100px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[50%] rounded-full bg-sky-200/40 blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_2px,transparent_3px)] [background-size:24px_24px] opacity-40 mix-blend-multiply"></div>

        {/* Glass Card Showcase */}
        <div className="glass w-[80%] max-w-[600px] rounded-[3rem] p-12 relative z-10 border-2 border-white/80 shadow-2xl shadow-amber-900/10 animate-float flex flex-col items-center text-center">
          
          <Image src="/landing-photo.jpg" alt="Student" width={240} height={240} className="object-contain mb-6 -mt-12" />

          <h2 className="text-[2.2rem] font-black text-slate-800 leading-[1.1] tracking-tight">
            Start your learning <span className="text-gradient">journey today.</span>
          </h2>
          
          <p className="mt-6 text-[16px] font-medium text-slate-600 leading-relaxed max-w-[85%]">
            Get unlimited access to thousands of practice quizzes, textbooks, and interactive CBC resources completely free.
          </p>

          <div className="mt-10 flex gap-4">
            <div className="px-5 py-2.5 rounded-full bg-white/60 border border-slate-200 text-sm font-bold text-slate-600 shadow-sm">🎓 Grades 1-9</div>
            <div className="px-5 py-2.5 rounded-full bg-white/60 border border-slate-200 text-sm font-bold text-slate-600 shadow-sm">📚 6+ Subjects</div>
          </div>

        </div>

      </div>

      {/* Left Column (Appears on right side visually) - The Form */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-between px-8 sm:px-16 py-8 relative z-10 bg-white shadow-2xl shadow-slate-200/50">
        
        {/* Top: Logo & Back Link */}
        <div className="flex items-center justify-between animate-fade-in">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm group-hover:shadow-md transition-shadow">
              <Image src="/daraja-logo.png" alt="Daraja Logo" width={40} height={40} className="h-9 w-9 object-contain" />
            </div>
            <span className="text-xl font-black tracking-widest text-slate-800 leading-none">DARAJA</span>
          </Link>

          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-[14px] font-bold text-slate-400 hover:text-sky-600 transition-colors">
              <ArrowLeft size={16} strokeWidth={2.5} /> Back
            </button>
            <Link href="/" className="flex items-center gap-2 text-[14px] font-bold text-slate-400 hover:text-sky-600 transition-colors">
              <Home size={16} strokeWidth={2.5} /> Home
            </Link>
          </div>
        </div>

        {/* Center: Register Form */}
        <div className="w-full max-w-[420px] mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
          
          <div className="mb-8">
            <h1 className="text-[2.5rem] font-black tracking-tight text-slate-800 mb-2">Create an account</h1>
            <p className="text-[15px] font-medium text-slate-500">
              Join the future of education in just a few clicks.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Account Type Selector */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <label className="cursor-pointer">
                <input type="radio" name="role" value="STUDENT" checked={formData.role === "STUDENT"} onChange={handleRoleChange} className="peer sr-only" />
                <div className="text-center py-3 rounded-2xl border-2 border-slate-200 peer-checked:border-sky-500 peer-checked:bg-sky-50 peer-checked:text-sky-700 text-slate-500 font-bold text-[13px] transition-all hover:border-slate-300">
                  Student
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="role" value="GUARDIAN" checked={formData.role === "GUARDIAN"} onChange={handleRoleChange} className="peer sr-only" />
                <div className="text-center py-3 rounded-2xl border-2 border-slate-200 peer-checked:border-sky-500 peer-checked:bg-sky-50 peer-checked:text-sky-700 text-slate-500 font-bold text-[13px] transition-all hover:border-slate-300">
                  Guardian
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="role" value="TEACHER" checked={formData.role === "TEACHER"} onChange={handleRoleChange} className="peer sr-only" />
                <div className="text-center py-3 rounded-2xl border-2 border-slate-200 peer-checked:border-sky-500 peer-checked:bg-sky-50 peer-checked:text-sky-700 text-slate-500 font-bold text-[13px] transition-all hover:border-slate-300">
                  Teacher
                </div>
              </label>
            </div>

            {/* Grade Selector (only for STUDENT) */}
            {formData.role === "STUDENT" && (
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-700 ml-1">Grade Level</label>
                <div className="relative">
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={(e: any) => handleChange(e)}
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors appearance-none"
                  >
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 z-50">
              <label className="text-[14px] font-bold text-slate-700 ml-1">School / Institution</label>
              <UICInput onSelect={(inst) => setFormData(f => ({ ...f, institutionId: inst?.id ?? null }))} />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} strokeWidth={2.5} />
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors placeholder:text-slate-400"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                </button>
              </div>
              <p className="text-xs text-slate-500 ml-1">Must contain letters, numbers, and special characters.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-slate-700 ml-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors placeholder:text-slate-400"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl">
                {error}
              </div>
            )}

            <button disabled={loading} type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-full py-4 text-[16px] font-bold shadow-xl shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-[1.02] transition-all mt-6 disabled:opacity-70 disabled:hover:scale-100">
              <UserCircle2 size={18} strokeWidth={2.5} /> {loading ? "Creating..." : "Create Account"}
            </button>
            
          </form>

          <div className="mt-8 text-center">
            <p className="text-[15px] font-medium text-slate-500">
              Already have an account? <Link href="/login" className="text-sky-600 font-bold hover:text-sky-700 transition-colors underline decoration-2 underline-offset-4 decoration-sky-200">Sign in here</Link>
            </p>
          </div>
          
        </div>

        {/* Bottom: Footer */}
        <div className="text-center animate-fade-in text-[13px] font-medium text-slate-400 pt-8">
          © 2026 Daraja Learning Platform.
        </div>
        
      </div>

    </main>
  );
}
