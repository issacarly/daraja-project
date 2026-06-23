// app/api/institutions/lookup/route.ts
// Live UIC lookup used by the registration form
// GET /api/institutions/lookup?q=ABC1        → search by UIC code (exact or partial)
// GET /api/institutions/lookup?name=Bosin    → search by school name (partial)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toUpperCase();
  const name = searchParams.get("name")?.trim();

  if (!q && !name) {
    return NextResponse.json({ error: "Provide ?q= (UIC) or ?name=" }, { status: 400 });
  }

  try {
    if (q) {
      // Exact UIC lookup first (for validation on submit)
      if (q.length === 4) {
        const institution = await prisma.institution.findUnique({
          where: { uic: q },
          select: { id: true, uic: true, name: true, classes: true },
        });
        if (!institution) {
          return NextResponse.json({ found: false }, { status: 404 });
        }
        return NextResponse.json({ found: true, institution });
      }

      // Partial UIC search (for autocomplete as user types)
      const results = await prisma.institution.findMany({
        where: { uic: { startsWith: q } },
        select: { id: true, uic: true, name: true },
        take: 10,
        orderBy: { name: "asc" },
      });
      return NextResponse.json({ results });
    }

    if (name) {
      // Name-based search for autocomplete
      const results = await prisma.institution.findMany({
        where: { name: { contains: name } },
        select: { id: true, uic: true, name: true },
        take: 10,
        orderBy: { name: "asc" },
      });
      return NextResponse.json({ results });
    }
  } catch (err) {
    console.error("Institution lookup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
