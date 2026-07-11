import StudentSidebar from "@/components/layout/StudentSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <StudentSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
