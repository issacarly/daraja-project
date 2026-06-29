"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home, Mail, Lock, ShieldQuestion, KeyRound, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetchQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/security-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Failed to fetch security question.");
      } else {
        setSecurityQuestion(data.securityQuestion);
        setStep(2);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityAnswer.trim()) {
      setError("Please enter an answer.");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, securityAnswer, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Failed to reset password.");
      } else {
        setStep(4);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* Right Column - Brand Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-100 items-center justify-center">
        <div className="absolute top-[20%] right-[20%] w-[50%] h-[50%] rounded-full bg-amber-300/30 blur-[100px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[50%] rounded-full bg-sky-200/40 blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_2px,transparent_3px)] [background-size:24px_24px] opacity-40 mix-blend-multiply"></div>
        <div className="glass w-[80%] max-w-[600px] rounded-[3rem] p-12 relative z-10 border-2 border-white/80 shadow-2xl shadow-amber-900/10 animate-float flex flex-col items-center text-center">
          <Image src="/landing-photo.png" alt="Student" width={240} height={240} className="object-contain mb-6 -mt-12" />
          <h2 className="text-[2.2rem] font-black text-slate-800 leading-[1.1] tracking-tight">
            Secure Account <span className="text-gradient">Recovery.</span>
          </h2>
          <p className="mt-6 text-[16px] font-medium text-slate-600 leading-relaxed max-w-[85%]">
            Regain access to your account quickly and securely using your personal security question.
          </p>
        </div>
      </div>

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

        {/* Center: Reset Forms */}
        <div className="w-full max-w-[400px] mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
          
          <div className="mb-8">
            <h1 className="text-[2.5rem] font-black tracking-tight text-slate-800 mb-2">Reset Password</h1>
            <p className="text-[15px] font-medium text-slate-500">
              {step === 1 && "Enter your email to find your account."}
              {step === 2 && "Answer your security question to verify your identity."}
              {step === 3 && "Create a new strong password."}
              {step === 4 && "Password reset successful!"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl">
              {error}
            </div>
          )}

          {step === 1 && (
            <form className="space-y-5" onSubmit={handleFetchQuestion}>
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} strokeWidth={2.5} />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-full py-4 text-[16px] font-bold shadow-xl shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-[1.02] transition-all mt-6">
                {loading ? "Searching..." : "Continue"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-5" onSubmit={handleVerifyAnswer}>
              <div className="p-4 bg-sky-50 border border-sky-100 rounded-2xl">
                <div className="flex items-center gap-3 text-sky-700 font-bold mb-1">
                  <ShieldQuestion size={20} /> Security Question
                </div>
                <p className="text-slate-700 text-sm font-medium">{securityQuestion}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-700 ml-1">Your Answer</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <KeyRound size={18} strokeWidth={2.5} />
                  </div>
                  <input 
                    type="text" 
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder="Enter your secret answer"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-full py-4 text-[16px] font-bold shadow-xl shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-[1.02] transition-all mt-6">
                Verify Answer
              </button>
            </form>
          )}

          {step === 3 && (
            <form className="space-y-5" onSubmit={handleResetPassword}>
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-700 ml-1">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} strokeWidth={2.5} />
                  </div>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-full py-4 text-[16px] font-bold shadow-xl shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-[1.02] transition-all mt-6">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-6">
                <CheckCircle2 size={40} strokeWidth={2.5} />
              </div>
              <p className="text-slate-600 font-medium text-[15px]">
                Your password has been successfully reset. You can now log in using your new password.
              </p>
              <Link href="/login" className="block w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full py-4 text-[16px] font-bold shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all">
                Return to Login
              </Link>
            </div>
          )}

          {step < 4 && (
            <div className="mt-8 text-center">
              <p className="text-[15px] font-medium text-slate-500">
                Remember your password? <Link href="/login" className="text-sky-600 font-bold hover:text-sky-700 transition-colors underline decoration-2 underline-offset-4 decoration-sky-200">Sign in here</Link>
              </p>
            </div>
          )}
          
        </div>

        {/* Bottom: Footer */}
        <div className="text-center animate-fade-in text-[13px] font-medium text-slate-400 pt-8">
          © 2026 Daraja Learning Platform.
        </div>
        
      </div>
    </main>
  );
}
