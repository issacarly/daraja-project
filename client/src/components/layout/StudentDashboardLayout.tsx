"use client";

import React from "react";
import StudentSidebar from "./StudentSidebar";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <StudentSidebar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
