"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, HelpCircle, Send, MessageSquare, ShieldAlert, CheckCircle2, ChevronDown, BookOpen } from "lucide-react";
import { submitHelpRequest } from "@/app/actions/help";

export const HELP_CATEGORIES = [
  { value: "TECHNICAL_ISSUE", label: "Technical issue (app not working)" },
  { value: "LOGIN_ACCOUNT", label: "Login or account problem" },
  { value: "CURRICULUM_CONTENT", label: "Curriculum or lesson content" },
  { value: "ASSESSMENT_GRADING", label: "Assessment or grading question" },
  { value: "PAYMENT_BILLING", label: "Payment or billing" },
  { value: "BUG_REPORT", label: "Something looks broken" },
  { value: "OTHER", label: "Something else" },
] as const;

export type HelpCategoryValue = typeof HELP_CATEGORIES[number]["value"];

type FAQItem = {
  q: string;
  a: string;
};

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "How do I access my subjects?",
    a: "Click on 'Subjects' in the left-hand sidebar navigation. You will see all the learning areas for your grade level. Select a card to view lessons, term assessments, and practice materials."
  },
  {
    q: "What does the Competency Ladder mean?",
    a: "Under the CBC framework, performance is grouped into four bands: Below Expectation (1 block), Approaching Expectation (2 blocks), Meeting Expectation (3 blocks), and Exceeding Expectation (4 blocks). These show your score bands in formative quizzes."
  },
  {
    q: "How do I attend a Live Class?",
    a: "Navigate to the 'Calendar' tab. If there is a class scheduled for today, click the 'Join Class' button. It will open a secure video conference link."
  },
  {
    q: "How can I contact my subject teacher?",
    a: "Open the 'Messages' tab in the left sidebar. Select your teacher from the list (such as Ms. Akinyi for Math or Mr. Mwangi for Science) to view your conversation history or send a message."
  }
];

export default function HelpPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    category: "TECHNICAL_ISSUE" as any,
    subject: "",
    message: ""
  });
  
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Error reading user data:", e);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await submitHelpRequest({
        category: formData.category,
        subject: formData.subject,
        message: formData.message,
        role: (user?.role?.toUpperCase() || "STUDENT") as any,
        name: user?.name || "Anonymous Student",
        email: user?.email || "anonymous@daraja.app",
        schoolName: user?.schoolName || user?.uic || undefined,
        gradeLevel: user?.grade || undefined
      });

      if (res.success) {
        setSubmitSuccess(true);
        setFormData({
          category: "TECHNICAL_ISSUE",
          subject: "",
          message: ""
        });
      } else {
        setError(res.error || "An error occurred while submitting. Please try again.");
      }
    } catch (err) {
      setError("Failed to submit support request. Please verify your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <div className="w-full px-8 py-6 bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-[15px] font-bold text-slate-500 hover:text-sky-600 transition-colors">
              <ArrowLeft size={18} strokeWidth={2.5} /> Back
            </button>
            <div className="h-5 w-[2px] bg-slate-200"></div>
            <Link href="/" className="flex items-center gap-2 text-[15px] font-bold text-slate-500 hover:text-sky-600 transition-colors">
              <Home size={18} strokeWidth={2.5} /> Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto px-8 py-12 md:py-16 flex-1 flex flex-col lg:flex-row gap-10">
        {/* Left Side: FAQs */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight flex items-center gap-3">
              <HelpCircle size={36} className="text-sky-600" />
              Help &amp; <span className="text-sky-600">FAQ</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Find answers to frequently asked questions about the Daraja CBC platform.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between font-bold text-slate-700 text-left hover:text-sky-600 transition-colors focus:outline-none"
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-slate-500 leading-relaxed border-t border-slate-100">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Help Ticket Form */}
        <div className="w-full lg:w-[420px] shrink-0">
          <div className="glass-card bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            {submitSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 size={36} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Request Submitted!</h2>
                <p className="text-sm text-slate-500 leading-relaxed px-4">
                  Your ticket has been logged in the support dashboard. An administrator will review your ticket shortly.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full transition-colors"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 mb-2">
                  <MessageSquare size={20} className="text-sky-600" />
                  <h2 className="font-bold text-slate-800 text-base">Submit Support Ticket</h2>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 border border-red-200">
                    <ShieldAlert size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-slate-400">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500 transition-colors"
                  >
                    {HELP_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-slate-400">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Short description of the issue..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-slate-400">Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your issue in detail so we can help..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500 transition-colors"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-sky-600/25 active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                    ) : (
                      <>
                        <Send size={12} />
                        Submit Ticket
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
