"use server";

import { PrismaClient, Grade, Term } from "@prisma/client";

const prisma = new PrismaClient();

export async function getSubjectDetails(subjectId: string, studentId?: string) {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        courses: {
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" },
            },
            quizzes: true,
          },
        },
      },
    });

    if (!subject) {
      throw new Error("Subject not found");
    }

    // Since we only seeded Subjects and not Courses/Lessons/Quizzes, 
    // we inject some mock data if there are no courses so the UI can be tested.
    let courses = subject.courses;

    if (courses.length === 0) {
      courses = [
        {
          id: "mock_course_1",
          title: "Term 1 Modules",
          description: "Core modules for the first term.",
          subjectId: subject.id,
          teacherId: null,
          grade: subject.grade,
          term: "TERM_1" as Term,
          createdAt: new Date(),
          lessons: [
            {
              id: "mock_lesson_1",
              title: `Introduction to ${subject.name}`,
              content: "Welcome to the first lesson of this subject.",
              videoUrl: "https://example.com/video1",
              fileUrl: null,
              orderIndex: 1,
              courseId: "mock_course_1",
            },
            {
              id: "mock_lesson_2",
              title: "Foundational Concepts",
              content: "In this lesson, we will cover the basics.",
              videoUrl: "https://example.com/video2",
              fileUrl: "https://example.com/worksheet.pdf",
              orderIndex: 2,
              courseId: "mock_course_1",
            },
          ],
          quizzes: [
            {
              id: "mock_quiz_1",
              title: "Term 1 Mid-Term Assessment",
              description: "Test your knowledge so far.",
              courseId: "mock_course_1",
              timeLimit: 30,
              createdAt: new Date(),
            },
          ],
        },
        {
          id: "mock_course_2",
          title: "Term 2 Modules",
          description: "Continuing our journey in " + subject.name,
          subjectId: subject.id,
          teacherId: null,
          grade: subject.grade,
          term: "TERM_2" as Term,
          createdAt: new Date(),
          lessons: [
            {
              id: "mock_lesson_3",
              title: "Advanced Topics",
              content: "Moving on to more advanced concepts.",
              videoUrl: null,
              fileUrl: null,
              orderIndex: 1,
              courseId: "mock_course_2",
            },
          ],
          quizzes: [],
        },
      ];
    }

    // Mock progress (e.g. random number of completed lessons)
    const progressPercentage = Math.floor(Math.random() * 100);

    return {
      success: true,
      subject: {
        ...subject,
        courses,
      },
      progressPercentage,
    };
  } catch (error: any) {
    console.error("Error fetching subject details:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch subject details",
    };
  }
}

export async function getAllSubjects() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: [{ grade: "asc" }, { name: "asc" }]
    });
    return { success: true, subjects };
  } catch (error: any) {
    console.error("Error fetching all subjects:", error);
    return { success: false, message: error.message };
  }
}
