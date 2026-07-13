import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { question, gradeLevel, subjectName, institutionId } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    // Cast institutionId to a number if present, to match the Int field type in MySQL
    const instId = institutionId ? Number(institutionId) : undefined;

    // Pull only the relevant curriculum slice — never the whole table
    const curriculum = await prisma.curriculum.findMany({
      where: {
        ...(gradeLevel && { gradeLevel }),
        ...(subjectName && { subjectName }),
        OR: [
          { institutionId: instId || undefined },
          { isDefault: true },
        ],
      },
      take: 10,
    });

    const contextBlock = curriculum
      .map(
        (c) =>
          `Grade: ${c.gradeLevel}, Subject: ${c.subjectName}, Term: ${c.term}\nContent: ${JSON.stringify(c.content)}`
      )
      .join("\n\n");

    const systemPrompt = `You are Daraja's curriculum assistant for Kenyan CBC primary education (Grades 1-9).
Answer ONLY using the curriculum data provided below. If the data doesn't cover the question, say so clearly instead of guessing.
Use the CBC assessment scale terminology (Below Expectation, Approaching Expectation, Meeting Expectation, Exceeding Expectation) where relevant.

CURRICULUM DATA:
${contextBlock || "No specific curriculum data found for this grade/subject."}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022", // Anthropic model mapping
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await response.json();
    const answer = data.content?.find((b: any) => b.type === "text")?.text || "No response generated.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("AI agent error:", error);
    return NextResponse.json({ error: "Failed to get an answer." }, { status: 500 });
  }
}
