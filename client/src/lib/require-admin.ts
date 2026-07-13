import { getServerSession } from "next-auth"; // adjust to your actual auth setup
import { prisma } from "@/lib/prisma";

export async function requireAdmin(allowedRoles?: string[]) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return { error: "Not authenticated", status: 401 };
  }
  const admin = await prisma.admin.findUnique({ where: { email: session.user.email } });
  if (!admin) return { error: "Not an admin", status: 403 };
  if (allowedRoles && !allowedRoles.includes(admin.role)) {
    return { error: "Insufficient role", status: 403 };
  }
  return { admin };
}
