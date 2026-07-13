"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface CurriculumAIWidgetProps {
  gradeLevel?: string;
  subjectName?: string;
  institutionId?: string;
}

export default function CurriculumAIWidget({
  gradeLevel,
  subjectName,
  institutionId,
}: CurriculumAIWidgetProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Hide the global generic assistant instance on specific subject details routes
  if (!subjectName && pathname.includes("/dashboard/subject/")) {
    return null;
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, gradeLevel, subjectName, institutionId }),
      });

      if (!res.ok) {
        throw new Error("The assistant couldn't answer that right now.");
      }

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Floating launcher button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open curriculum assistant"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-700 px-5 py-3 text-white shadow-lg shadow-blue-900/20 hover:opacity-90 transition"
        >
          <SparkleIcon />
          <span className="text-sm font-medium hidden sm:inline">Ask Daraja</span>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-96 h-[85vh] sm:h-[600px] max-h-[calc(100vh-1.5rem)] flex flex-col bg-white/80 backdrop-blur-xl border border-white/40 sm:rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-700 text-white">
            <div className="flex items-center gap-2">
              <SparkleIcon />
              <div>
                <p className="text-sm font-semibold leading-tight">Daraja Assistant</p>
                <p className="text-xs text-white/80 leading-tight">
                  {subjectName ? `${subjectName} · ${gradeLevel || "CBC"}` : "Ask about the curriculum"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="text-white/90 hover:text-white text-xl leading-none px-1"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-sm text-blue-900/60 mt-8 px-4">
                <p className="mb-2 font-medium text-blue-900/80">
                  Ask me anything about the curriculum
                </p>
                <p>
                  e.g. "What topics are covered in Grade 5 Science, Term 2?" or
                  "What does Meeting Expectation look like for this assessment?"
                </p>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-blue-700 text-white rounded-br-sm"
                      : "bg-white/90 border border-blue-100 text-blue-950 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/90 border border-blue-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                  <TypingDots />
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-600 text-center">{error}</p>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-blue-100 bg-white/60">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-700 text-white disabled:opacity-40 transition"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L14.09 8.26L20.36 10.35L14.09 12.44L12 18.7L9.91 12.44L3.64 10.35L9.91 8.26L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 20L21 12L3 4V10L16 12L3 14V20Z" fill="currentColor" />
    </svg>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-1 items-center h-3">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
    </div>
  );
}
