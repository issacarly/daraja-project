import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, subject, message, role, name, email, schoolName, gradeLevel } = body;

    if (!category || !subject || !message || !role || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const helpRequest = await prisma.helpRequest.create({
      data: {
        category,
        subject,
        message,
        role,
        name,
        email,
        schoolName: schoolName || null,
        gradeLevel: gradeLevel || null,
      },
    });

    return NextResponse.json({ success: true, id: helpRequest.id }, { status: 201 });
  } catch (error) {
    console.error("Help request submission failed:", error);
    return NextResponse.json(
      { error: "Failed to submit help request." },
      { status: 500 }
    );
  }
}

// Used later by the admin dashboard to list requests
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const requests = await prisma.helpRequest.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Failed to fetch help requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch help requests." },
      { status: 500 }
    );
  }
}
