"use server";

import { prisma } from "@/lib/prisma";

export async function submitHelpRequest(data: {
  category: "TECHNICAL_ISSUE" | "LOGIN_ACCOUNT" | "CURRICULUM_CONTENT" | "ASSESSMENT_GRADING" | "PAYMENT_BILLING" | "BUG_REPORT" | "OTHER";
  subject: string;
  message: string;
  role: "STUDENT" | "GUARDIAN" | "TEACHER";
  name: string;
  email: string;
  schoolName?: string;
  gradeLevel?: string;
}) {
  try {
    const request = await prisma.helpRequest.create({
      data: {
        category: data.category,
        subject: data.subject,
        message: data.message,
        role: data.role,
        name: data.name,
        email: data.email,
        schoolName: data.schoolName || null,
        gradeLevel: data.gradeLevel || null,
      },
    });
    return { success: true, id: request.id };
  } catch (err: any) {
    console.error("Failed to submit help request:", err);
    return { success: false, error: err.message || "Failed to submit request" };
  }
}
