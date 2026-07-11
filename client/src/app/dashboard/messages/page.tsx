"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Inbox, Send, User, Search, Smile, MessageSquare } from "lucide-react";

type Conversation = {
  id: string;
  teacherName: string;
  subject: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: { sender: "STUDENT" | "TEACHER"; text: string; time: string }[];
};

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    teacherName: "Ms. Akinyi Otieno",
    subject: "Mathematics",
    avatar: "👩‍🏫",
    lastMessage: "Hello Issa, did you finish the fractions quick check? You did great!",
    time: "10:30 AM",
    unread: true,
    messages: [
      { sender: "TEACHER", text: "Welcome to Grade 5 Mathematics!", time: "Monday" },
      { sender: "STUDENT", text: "Thank you Ms. Akinyi! I am excited.", time: "Monday" },
      { sender: "TEACHER", text: "Hello Issa, did you finish the fractions quick check? You did great!", time: "10:30 AM" }
    ]
  },
  {
    id: "c2",
    teacherName: "Mr. John Mwangi",
    subject: "Science & Technology",
    avatar: "👨‍🔬",
    lastMessage: "Tomorrow's class will cover photosynthesis. Please read ahead.",
    time: "Yesterday",
    unread: false,
    messages: [
      { sender: "TEACHER", text: "Make sure you downloaded the worksheet for the plant experiment.", time: "Wednesday" },
      { sender: "STUDENT", text: "Yes, I have it ready in my folder.", time: "Wednesday" },
      { sender: "TEACHER", text: "Tomorrow's class will cover photosynthesis. Please read ahead.", time: "Yesterday" }
    ]
  },
  {
    id: "c3",
    teacherName: "Mrs. Grace Wanjiku",
    subject: "English Language",
    avatar: "👩‍💻",
    lastMessage: "I have reviewed your writing submission. It's excellent!",
    time: "2 days ago",
    unread: false,
    messages: [
      { sender: "STUDENT", text: "Hello teacher, did you see my spelling homework?", time: "Tuesday" },
      { sender: "TEACHER", text: "Yes, I did. I have reviewed your writing submission. It's excellent!", time: "Tuesday" }
    ]
  }
];

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string>("c1");
  const [inputText, setInputText] = useState("");

  const activeConv = conversations.find(c => c.id === activeId) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      sender: "STUDENT" as const,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeId) {
          return {
            ...c,
            lastMessage: inputText,
            time: "Just now",
            unread: false,
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );
    setInputText("");
  };

  const selectConversation = (id: string) => {
    setActiveId(id);
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, unread: false } : c))
    );
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

      <div className="flex-1 max-w-6xl w-full mx-auto px-8 py-10 flex flex-col md:flex-row gap-6 overflow-hidden max-h-[calc(100vh-80px)]">
        {/* Sidebar list */}
        <div className="w-full md:w-[320px] bg-white rounded-3xl border border-slate-200 flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100 shrink-0">
            <h1 className="text-xl font-black text-slate-800 mb-3">Teacher Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search teachers..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.map((c) => {
              const isActive = c.id === activeId;
              return (
                <button
                  key={c.id}
                  onClick={() => selectConversation(c.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-2xl transition-colors text-left relative ${
                    isActive ? "bg-sky-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <p className="font-bold text-slate-800 text-sm truncate">{c.teacherName}</p>
                      <span className="text-[10px] text-slate-400 font-semibold shrink-0">{c.time}</span>
                    </div>
                    <p className="text-[11px] font-bold text-sky-600 mb-1">{c.subject}</p>
                    <p className={`text-xs truncate ${c.unread && !isActive ? "text-slate-800 font-bold" : "text-slate-400"}`}>
                      {c.lastMessage}
                    </p>
                  </div>
                  {c.unread && !isActive && (
                    <span className="absolute top-1/2 -translate-y-1/2 right-3 w-2.5 h-2.5 rounded-full bg-amber-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 flex flex-col overflow-hidden">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                  {activeConv.avatar}
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 text-base">{activeConv.teacherName}</h2>
                  <p className="text-xs text-sky-600 font-bold">{activeConv.subject} Teacher</p>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                {activeConv.messages.map((m, idx) => {
                  const isStudent = m.sender === "STUDENT";
                  return (
                    <div 
                      key={idx} 
                      className={`flex ${isStudent ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        isStudent 
                          ? "bg-sky-600 text-white rounded-tr-none" 
                          : "bg-white text-slate-700 rounded-tl-none border border-slate-200"
                      }`}>
                        <p className="leading-relaxed">{m.text}</p>
                        <p className={`text-[9px] mt-1 text-right font-medium ${isStudent ? "text-sky-100" : "text-slate-400"}`}>
                          {m.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Box */}
              <form 
                onSubmit={handleSendMessage} 
                className="p-4 border-t border-slate-100 flex items-center gap-3 bg-white shrink-0"
              >
                <button type="button" className="text-slate-400 hover:text-slate-600">
                  <Smile size={20} />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Write a message to ${activeConv.teacherName}...`}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-sky-500 transition-colors"
                />
                <button 
                  type="submit" 
                  className="p-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl shadow-sm shadow-sky-600/20 active:scale-95 transition-all"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 text-center">
              <MessageSquare size={48} className="text-slate-200 mb-4" />
              <p className="font-semibold text-lg">No conversation selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
