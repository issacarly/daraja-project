"use server";

import { prisma } from "@/lib/prisma";

export async function getStudentDashboardData(gradeString: string) {
  // gradeString might be "Grade 5" or "GRADE_5". Map to enum.
  const mappedGrade = gradeString.toUpperCase().replace(' ', '_');
  
  const subjects = await prisma.subject.findMany({
    where: {
      grade: mappedGrade as any
    }
  });

  const coreSubjects = subjects.filter((s: any) => !s.isOptional).map((s: any) => ({
    id: s.id,
    name: s.name,
    icon: s.icon || 'BookOpen',
    color: s.color || '#0ea5e9',
    level: Math.floor(Math.random() * 4) + 1, // Mock competency
    nextLesson: `Introduction to ${s.name}`,
    isOptional: false
  }));

  const optionalSubjects = subjects.filter((s: any) => s.isOptional).map((s: any) => ({
    id: s.id,
    name: s.name,
    icon: s.icon || 'Palette',
    color: s.color || '#ec4899',
    level: Math.floor(Math.random() * 4) + 1, // Mock competency
    nextLesson: `Introduction to ${s.name}`,
    isOptional: true
  }));

  return {
    coreSubjects,
    optionalSubjects,
    mappedGrade
  };
}
