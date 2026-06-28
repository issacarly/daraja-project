// lib/subject-mock-data.ts
// Replace these with real Prisma queries from your server actions.
// All data shaped to match types/subject.ts exactly.

import type { Subject, TermBlock, CBCTerm } from "@/types/subject";

const makeLesson = (
  id: string, title: string, strand: string, order: number,
  opts: Partial<{ contentType: any; videoUrl: string; durationMinutes: number; isCompleted: boolean; isLocked: boolean; subStrand: string }>
) => ({
  id, title, strand,
  subStrand: opts.subStrand,
  contentType: opts.contentType ?? "VIDEO",
  videoUrl: opts.videoUrl,
  durationMinutes: opts.durationMinutes ?? 20,
  order,
  isCompleted: opts.isCompleted ?? false,
  isLocked: opts.isLocked ?? false,
  notes: "Review the strand outcomes before watching.",
});

const makeQuestion = (id: string, text: string, opts: any) => ({
  id, text,
  type: opts.type ?? "MCQ",
  options: opts.options,
  correctAnswer: opts.correctAnswer,
  marks: opts.marks ?? 2,
  strand: opts.strand,
  explanation: opts.explanation,
});

const TERM_BLOCKS: Record<CBCTerm, TermBlock> = {
  TERM_1: {
    term: "TERM_1",
    lessons: [
      makeLesson("l1", "Introduction to Fractions", "Numbers",     1, { isCompleted: true,  durationMinutes: 18, videoUrl: "https://www.youtube.com/embed/n0FZhQ_GkKw", subStrand: "Fractions" }),
      makeLesson("l2", "Adding Like Fractions",      "Numbers",     2, { isCompleted: true,  durationMinutes: 22, videoUrl: "https://www.youtube.com/embed/n0FZhQ_GkKw", subStrand: "Fractions" }),
      makeLesson("l3", "Subtracting Fractions",      "Numbers",     3, { isCompleted: false, durationMinutes: 20, videoUrl: "https://www.youtube.com/embed/n0FZhQ_GkKw", subStrand: "Fractions" }),
      makeLesson("l4", "Equivalent Fractions",       "Numbers",     4, { isCompleted: false, durationMinutes: 25, isLocked: false, subStrand: "Fractions" }),
      makeLesson("l5", "Introduction to Decimals",   "Numbers",     5, { isCompleted: false, durationMinutes: 20, isLocked: true,  subStrand: "Decimals"  }),
      makeLesson("l6", "Perimeter of Shapes",        "Measurement", 6, { isCompleted: false, durationMinutes: 30, isLocked: true,  subStrand: "Length"    }),
    ],
    assessments: [
      {
        id: "a1", title: "Fractions Quick Check",
        type: "FORMATIVE_QUIZ", term: "TERM_1",
        description: "A short check on fraction concepts from Lessons 1–2.",
        timeLimitMinutes: 15, totalMarks: 20,
        isAvailable: true, isSubmitted: true, score: 16, competencyLevel: "ME",
        questions: [
          makeQuestion("q1", "What is 1/4 + 2/4?",         { type: "MCQ", options: ["1/4","3/4","3/8","1"], correctAnswer: "3/4", strand: "Numbers", marks: 2 }),
          makeQuestion("q2", "Write 3/6 in its simplest form.", { type: "SHORT_ANSWER", correctAnswer: "1/2", strand: "Numbers", marks: 3 }),
          makeQuestion("q3", "True or False: 2/5 > 3/5",   { type: "TRUE_FALSE", correctAnswer: "False", strand: "Numbers", marks: 2 }),
        ],
      },
      {
        id: "a2", title: "Term 1 Mid-Term Test",
        type: "MID_TERM_TEST", term: "TERM_1",
        description: "Covers Numbers (Fractions & Decimals) and Measurement (Perimeter).",
        instructions: "Answer ALL questions. Show all working. Time allowed: 1 hour 30 minutes.",
        timeLimitMinutes: 90, totalMarks: 60,
        isAvailable: true, isSubmitted: false,
        questions: [
          makeQuestion("q4", "Calculate the perimeter of a rectangle 8 cm by 5 cm.", { type: "SHORT_ANSWER", correctAnswer: "26 cm", strand: "Measurement", marks: 4 }),
          makeQuestion("q5", "Arrange in ascending order: 0.3, 0.03, 0.33",         { type: "SHORT_ANSWER", strand: "Numbers", marks: 3 }),
          makeQuestion("q6", "John has 3/8 of a pizza. Mary has 2/8. How much do they have together?", { type: "SHORT_ANSWER", correctAnswer: "5/8", strand: "Numbers", marks: 4 }),
        ],
      },
      {
        id: "a3", title: "Term 1 End-Term Exam",
        type: "END_TERM_EXAM", term: "TERM_1",
        description: "Comprehensive end-of-term examination. Contributes to CBA score.",
        instructions: "Answer ALL questions in Section A. Choose ONE question from Section B.",
        timeLimitMinutes: 120, totalMarks: 100,
        isAvailable: false, isSubmitted: false,
        questions: [],
      },
    ],
    liveClasses: [
      {
        id: "lc1", title: "Fractions — Live Revision with Ms. Akinyi",
        description: "Interactive session — bring your exercise books and questions!",
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 60, status: "SCHEDULED",
        meetingUrl: "https://meet.jit.si/daraja-math-grade5-t1",
        teacherName: "Ms. Akinyi Otieno",
        maxAttendees: 35, term: "TERM_1", subject: "Mathematics",
      },
      {
        id: "lc2", title: "Decimals Introduction — Live Class",
        description: "We'll work through 10 practice problems together.",
        scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 45, status: "ENDED",
        recordingUrl: "https://example.com/recording/lc2",
        teacherName: "Ms. Akinyi Otieno",
        attendees: 28, term: "TERM_1", subject: "Mathematics",
      },
    ],
    pastPapers: [
      { id: "pp1", title: "Mathematics Grade 5 Term 1 — 2023", year: 2023, term: "TERM_1", type: "SCHOOL", fileUrl: "#", addedAt: "2024-01-15", description: "End-term paper from Nairobi Primary." },
      { id: "pp2", title: "Mathematics Grade 5 Term 1 — 2022", year: 2022, term: "TERM_1", type: "SCHOOL", fileUrl: "#", addedAt: "2023-01-10" },
    ],
  },

  TERM_2: {
    term: "TERM_2",
    lessons: [
      makeLesson("l7",  "Geometry — Types of Angles", "Geometry",    1, { isCompleted: false, durationMinutes: 20, isLocked: true }),
      makeLesson("l8",  "Measuring Angles",            "Geometry",    2, { isCompleted: false, durationMinutes: 25, isLocked: true }),
      makeLesson("l9",  "Area of Rectangles",          "Measurement", 3, { isCompleted: false, durationMinutes: 22, isLocked: true }),
      makeLesson("l10", "Time — 12 and 24 hour clock", "Measurement", 4, { isCompleted: false, durationMinutes: 18, isLocked: true }),
      makeLesson("l11", "Data Handling — Tally Charts","Data",        5, { isCompleted: false, durationMinutes: 30, isLocked: true }),
    ],
    assessments: [
      {
        id: "a4", title: "Geometry Quiz",
        type: "FORMATIVE_QUIZ", term: "TERM_2",
        description: "Quick check on angles and geometry basics.",
        timeLimitMinutes: 20, totalMarks: 30,
        isAvailable: false, isSubmitted: false, questions: [],
      },
      {
        id: "a5", title: "Term 2 Mid-Term Test",
        type: "MID_TERM_TEST", term: "TERM_2",
        description: "Geometry, Measurement and Data Handling.",
        timeLimitMinutes: 90, totalMarks: 60,
        isAvailable: false, isSubmitted: false, questions: [],
      },
      {
        id: "a6", title: "Term 2 End-Term Exam",
        type: "END_TERM_EXAM", term: "TERM_2",
        description: "Comprehensive examination for Term 2.",
        timeLimitMinutes: 120, totalMarks: 100,
        isAvailable: false, isSubmitted: false, questions: [],
      },
    ],
    liveClasses: [
      {
        id: "lc3", title: "Geometry — Angles Live Session",
        scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 60, status: "SCHEDULED",
        teacherName: "Ms. Akinyi Otieno",
        meetingUrl: "https://meet.jit.si/daraja-math-grade5-t2",
        maxAttendees: 35, term: "TERM_2", subject: "Mathematics",
      },
    ],
    pastPapers: [
      { id: "pp3", title: "Mathematics Grade 5 Term 2 — 2023", year: 2023, term: "TERM_2", type: "SCHOOL", fileUrl: "#", addedAt: "2024-07-10" },
      { id: "pp4", title: "Mathematics Grade 5 Term 2 — 2022", year: 2022, term: "TERM_2", type: "MOCK",   fileUrl: "#", addedAt: "2023-07-05" },
    ],
  },

  TERM_3: {
    term: "TERM_3",
    lessons: [
      makeLesson("l12", "Money and Financial Literacy",  "Numbers",     1, { isCompleted: false, isLocked: true, durationMinutes: 25 }),
      makeLesson("l13", "Profit and Loss",               "Numbers",     2, { isCompleted: false, isLocked: true, durationMinutes: 20 }),
      makeLesson("l14", "Ratio and Proportion",          "Numbers",     3, { isCompleted: false, isLocked: true, durationMinutes: 22 }),
      makeLesson("l15", "Volume of Solids",              "Measurement", 4, { isCompleted: false, isLocked: true, durationMinutes: 30 }),
    ],
    assessments: [
      {
        id: "a7", title: "Money & Ratio Quiz",
        type: "FORMATIVE_QUIZ", term: "TERM_3",
        description: "Covers financial literacy and ratio concepts.",
        timeLimitMinutes: 20, totalMarks: 30,
        isAvailable: false, isSubmitted: false, questions: [],
      },
      {
        id: "a8", title: "Term 3 End-Term Exam",
        type: "END_TERM_EXAM", term: "TERM_3",
        description: "Final examination for the year. KNEC CBA component.",
        timeLimitMinutes: 120, totalMarks: 100,
        isAvailable: false, isSubmitted: false, questions: [],
      },
    ],
    liveClasses: [],
    pastPapers: [
      { id: "pp5", title: "Mathematics Grade 5 Term 3 — 2023", year: 2023, term: "TERM_3", type: "SCHOOL", fileUrl: "#", addedAt: "2024-11-01" },
      { id: "pp6", title: "KNEC Grade 5 Mock — 2022",          year: 2022, term: "TERM_3", type: "KNEC",   fileUrl: "#", addedAt: "2023-11-10", description: "Official KNEC-style mock paper." },
    ],
  },
};

export function getMockSubject(id: string): Subject {
  return {
    id,
    name: "Mathematics",
    grade: "GRADE_5",
    icon: "Calculator",
    color: "#f59e0b",
    description: "Build number sense, geometry, measurement, and data skills aligned with the CBC Grade 5 curriculum.",
    terms: [TERM_BLOCKS.TERM_1, TERM_BLOCKS.TERM_2, TERM_BLOCKS.TERM_3],
    progressPercentage: 33,
  };
}
