"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home, Mail, Lock, LogIn } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "STUDENT"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        if (data.detail && Array.isArray(data.detail)) {
          setError(data.detail[0].msg);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError(data.message || "Login failed");
        }
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex font-sans selection:bg-sky-200 selection:text-sky-900">
      
      {/* Left Column - The Form */}
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

        {/* Center: Login Form */}
        <div className="w-full max-w-[420px] mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
          
          <div className="mb-10">
            <h1 className="text-[2.5rem] font-black tracking-tight text-slate-800 mb-2">Welcome back</h1>
            <p className="text-[15px] font-medium text-slate-500">
              Please enter your details to sign in.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Account Type Selector */}
            <div className="grid grid-cols-3 gap-3">
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
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                <span className="text-[14px] font-semibold text-slate-600">Remember me</span>
              </label>
              <Link href="#" className="text-[14px] font-bold text-sky-600 hover:text-sky-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl">
                {error}
              </div>
            )}

            <button disabled={loading} type="submit" className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white rounded-full py-4 text-[16px] font-bold shadow-xl shadow-slate-800/20 hover:bg-slate-700 hover:scale-[1.02] transition-all mt-4 disabled:opacity-70 disabled:hover:scale-100">
              <LogIn size={18} strokeWidth={2.5} /> {loading ? "Signing In..." : "Sign In"}
            </button>
            
          </form>

          <div className="mt-10 text-center">
            <p className="text-[15px] font-medium text-slate-500">
              Don't have an account? <Link href="/register" className="text-sky-600 font-bold hover:text-sky-700 transition-colors underline decoration-2 underline-offset-4 decoration-sky-200">Sign up here</Link>
            </p>
          </div>
          
        </div>

        {/* Bottom: Footer */}
        <div className="text-center animate-fade-in text-[13px] font-medium text-slate-400">
          © 2026 Daraja Learning Platform. All rights reserved.
        </div>
        
      </div>

      {/* Right Column - Brand Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-100 items-center justify-center">
        
        {/* Background Glowing Orbs */}
        <div className="absolute top-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-sky-300/40 blur-[100px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[50%] rounded-full bg-amber-200/40 blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_2px,transparent_3px)] [background-size:24px_24px] opacity-40 mix-blend-multiply"></div>

        {/* Glass Card Showcase */}
        <div className="glass w-[80%] max-w-[600px] rounded-[3rem] p-12 relative z-10 border-2 border-white/80 shadow-2xl shadow-sky-900/10 animate-float-delayed flex flex-col items-center text-center">
          
          <Image src="/landing-photo.jpg" alt="Student" width={240} height={240} className="object-contain mb-6 -mt-12" />

          <h2 className="text-[2.2rem] font-black text-slate-800 leading-[1.1] tracking-tight">
            The bridge to your <span className="text-gradient">academic success.</span>
          </h2>
          
          <p className="mt-6 text-[16px] font-medium text-slate-600 leading-relaxed max-w-[80%]">
            Join thousands of Kenyan students, teachers, and guardians experiencing the future of the CBC curriculum online.
          </p>

          <div className="mt-10 flex -space-x-4">
            <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden"><Image src="/landing-photo.jpg" alt="Student" width={48} height={48} className="object-cover" /></div>
            <div className="w-12 h-12 rounded-full border-4 border-white bg-sky-200 flex items-center justify-center text-sky-700 font-bold text-sm">+2k</div>
          </div>
          <p className="mt-3 text-[13px] font-bold text-slate-400 uppercase tracking-widest">Active Learners</p>

        </div>

      </div>

    </main>
  );
}