"use client";
// components/tabs/LiveClassesTab.tsx
// Student view of live classes hosted by their teacher.
// - Upcoming: countdown, join button (opens Jitsi / Meet / Zoom URL)
// - Live NOW: pulsing indicator, instant join
// - Ended: recording link if available
// Teacher dashboard controls scheduling — students only see and join.

import { useState } from "react";
import {
  Video, Clock, Users, Calendar, PlayCircle,
  Radio, CheckCircle2, ExternalLink, Bell, BellOff
} from "lucide-react";
import type { TermBlock, LiveClass, CBCTerm } from "@/types/subject";
import { TERM_LABELS } from "@/types/subject";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long" });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
}

function getCountdown(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "Now";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `In ${d}d ${h}h`;
  if (h > 0) return `In ${h}h ${m}m`;
  return `In ${m}m`;
}

function LiveClassCard({ liveClass, color }: { liveClass: LiveClass; color: string }) {
  const isLive       = liveClass.status === "LIVE";
  const isScheduled  = liveClass.status === "SCHEDULED";
  const isEnded      = liveClass.status === "ENDED";
  const isCancelled  = liveClass.status === "CANCELLED";

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden transition-all
        ${isLive ? "border-red-300 shadow-lg shadow-red-100" : "border-slate-200 hover:shadow-md"}`}
    >
      {/* Status bar */}
      <div
        className="h-1.5 w-full"
        style={{
          backgroundColor: isLive ? "#ef4444" : isScheduled ? color : isEnded ? "#10b981" : "#94a3b8",
        }}
      />

      <div className="p-5">
        {/* Status badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                LIVE NOW
              </span>
            )}
            {isScheduled && (
              <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ color, backgroundColor: `${color}15`, border: `1px solid ${color}40` }}>
                <Calendar size={11} /> {getCountdown(liveClass.scheduledAt)}
              </span>
            )}
            {isEnded && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                <CheckCircle2 size={11} /> Ended
              </span>
            )}
            {isCancelled && (
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Cancelled</span>
            )}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide shrink-0">
            {TERM_LABELS[liveClass.term]}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-800 text-base leading-snug mb-1">{liveClass.title}</h3>
        {liveClass.description && (
          <p className="text-sm text-slate-500 mb-3 leading-relaxed">{liveClass.description}</p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <Video size={12} /> {liveClass.teacherName}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {liveClass.durationMinutes} min
          </span>
          {isScheduled && (
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {formatDate(liveClass.scheduledAt)} at {formatTime(liveClass.scheduledAt)}
            </span>
          )}
          {(isEnded && liveClass.attendees) && (
            <span className="flex items-center gap-1">
              <Users size={12} /> {liveClass.attendees} attended
            </span>
          )}
          {isScheduled && liveClass.maxAttendees && (
            <span className="flex items-center gap-1">
              <Users size={12} /> Max {liveClass.maxAttendees}
            </span>
          )}
        </div>

        {/* Action */}
        {isLive && liveClass.meetingUrl && (
          <a
            href={liveClass.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            <Radio size={16} className="animate-pulse" /> Join Live Now
            <ExternalLink size={14} />
          </a>
        )}

        {isScheduled && liveClass.meetingUrl && (
          <div className="flex gap-2">
            <a
              href={liveClass.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: color }}
            >
              <ExternalLink size={14} /> Join When Live
            </a>
            <button className="w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
              <Bell size={16} />
            </button>
          </div>
        )}

        {isEnded && liveClass.recordingUrl && (
          <a
            href={liveClass.recordingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <PlayCircle size={16} className="text-sky-500" /> Watch Recording
          </a>
        )}

        {isEnded && !liveClass.recordingUrl && (
          <p className="text-xs text-slate-400 text-center py-2">Recording not available</p>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function LiveClassesTab({
  terms, color,
}: { terms: TermBlock[]; color: string }) {
  const [filterTerm, setFilterTerm] = useState<CBCTerm | "ALL">("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const allClasses = terms.flatMap((t) => t.liveClasses);

  const filtered = allClasses.filter((lc) => {
    const matchTerm   = filterTerm === "ALL" || lc.term === filterTerm;
    const matchStatus = filterStatus === "ALL" || lc.status === filterStatus;
    return matchTerm && matchStatus;
  });

  // Sort: LIVE first, then SCHEDULED (soonest first), then ENDED (most recent first)
  const sorted = [...filtered].sort((a, b) => {
    const order: Record<string, number> = { LIVE: 0, SCHEDULED: 1, ENDED: 2, CANCELLED: 3 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
  });

  const liveCount = allClasses.filter((lc) => lc.status === "LIVE").length;
  const upcomingCount = allClasses.filter((lc) => lc.status === "SCHEDULED").length;

  return (
    <div>
      {/* Live now banner */}
      {liveCount > 0 && (
        <div className="mb-5 flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 border border-red-200">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shrink-0" />
          <p className="text-sm font-bold text-red-700">
            {liveCount} class{liveCount > 1 ? "es" : ""} live right now!
          </p>
        </div>
      )}

      {/* Info callout if no live */}
      {liveCount === 0 && (
        <div className="glass-card rounded-2xl px-5 py-4 mb-5 flex items-start gap-3">
          <Video size={18} className="text-sky-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-800">Join live classes with your teacher</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {upcomingCount > 0
                ? `${upcomingCount} upcoming class${upcomingCount > 1 ? "es" : ""} scheduled. You can join via Google Meet or Jitsi — no account needed.`
                : "Your teacher will schedule live sessions here. You'll see a countdown and join button when one is coming up."}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1 glass-card rounded-xl p-1">
          {[{ id: "ALL", label: "All terms" }, ...terms.map((t) => ({ id: t.term, label: TERM_LABELS[t.term] }))].map(({ id, label }) => (
            <button key={id} onClick={() => setFilterTerm(id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filterTerm === id ? "text-white" : "text-slate-500"}`}
              style={filterTerm === id ? { backgroundColor: color } : {}}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 glass-card rounded-xl p-1">
          {[
            { id: "ALL",       label: "All"       },
            { id: "LIVE",      label: "Live"      },
            { id: "SCHEDULED", label: "Upcoming"  },
            { id: "ENDED",     label: "Recorded"  },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setFilterStatus(id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filterStatus === id ? "text-white" : "text-slate-500"}`}
              style={filterStatus === id ? { backgroundColor: color } : {}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="p-8 text-center glass-card rounded-2xl text-slate-400 text-sm">
          No live classes found for your current filter.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {sorted.map((lc) => (
            <LiveClassCard key={lc.id} liveClass={lc} color={color} />
          ))}
        </div>
      )}
    </div>
  );
}
