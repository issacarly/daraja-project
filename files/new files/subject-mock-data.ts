// lib/subject-mock-data.ts
// Replace individual subject content blocks with real Prisma queries as you author them.
// All data shaped to match types/subject.ts exactly.
//
// KEY CHANGE FROM PREVIOUS VERSION:
// This file no longer returns one hardcoded "Mathematics" object for every id.
// Instead, `buildSubjectContent(meta)` takes the REAL subject row (id, name, icon,
// color, grade, description — fetched from your Prisma-backed `getAllSubjects`
// action) and merges it with term content looked up by subject NAME, not by the
// database id (which is a cuid and can't be hardcoded into mock data).
//
// Subjects without an authored content block fall back to `DEFAULT_TERMS`, a
// clearly-labelled "content coming soon" block — never to another subject's data.

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

const emptyTermBlock = (term: CBCTerm): TermBlock => ({
  term,
  lessons: [],
  assessments: [],
  liveClasses: [],
  pastPapers: [],
});

// ─── Fallback for any subject without authored content yet ────────────────

const DEFAULT_TERMS: Record<CBCTerm, TermBlock> = {
  TERM_1: emptyTermBlock("TERM_1"),
  TERM_2: emptyTermBlock("TERM_2"),
  TERM_3: emptyTermBlock("TERM_3"),
};

// ─── Mathematics ────────────────────────────────────────────────────────────

const MATHEMATICS_TERMS: Record<CBCTerm, TermBlock> = {
  TERM_1: {
    term: "TERM_1",
    lessons: [
      makeLesson("m-l1", "Introduction to Fractions", "Numbers",     1, { isCompleted: true,  durationMinutes: 18, videoUrl: "https://www.youtube.com/embed/n0FZhQ_GkKw", subStrand: "Fractions" }),
      makeLesson("m-l2", "Adding Like Fractions",      "Numbers",     2, { isCompleted: true,  durationMinutes: 22, videoUrl: "https://www.youtube.com/embed/n0FZhQ_GkKw", subStrand: "Fractions" }),
      makeLesson("m-l3", "Subtracting Fractions",      "Numbers",     3, { isCompleted: false, durationMinutes: 20, videoUrl: "https://www.youtube.com/embed/n0FZhQ_GkKw", subStrand: "Fractions" }),
      makeLesson("m-l4", "Equivalent Fractions",       "Numbers",     4, { isCompleted: false, durationMinutes: 25, subStrand: "Fractions" }),
      makeLesson("m-l5", "Introduction to Decimals",   "Numbers",     5, { isCompleted: false, durationMinutes: 20, isLocked: true, subStrand: "Decimals" }),
      makeLesson("m-l6", "Perimeter of Shapes",        "Measurement", 6, { isCompleted: false, durationMinutes: 30, isLocked: true, subStrand: "Length" }),
    ],
    assessments: [
      {
        id: "m-a1", title: "Fractions Quick Check", type: "FORMATIVE_QUIZ", term: "TERM_1",
        description: "A short check on fraction concepts from Lessons 1–2.",
        timeLimitMinutes: 15, totalMarks: 20,
        isAvailable: true, isSubmitted: true, score: 16, competencyLevel: "ME",
        questions: [
          makeQuestion("m-q1", "What is 1/4 + 2/4?", { type: "MCQ", options: ["1/4","3/4","3/8","1"], correctAnswer: "3/4", strand: "Numbers", marks: 2 }),
          makeQuestion("m-q2", "Write 3/6 in its simplest form.", { type: "SHORT_ANSWER", correctAnswer: "1/2", strand: "Numbers", marks: 3 }),
          makeQuestion("m-q3", "True or False: 2/5 > 3/5", { type: "TRUE_FALSE", correctAnswer: "False", strand: "Numbers", marks: 2 }),
        ],
      },
      {
        id: "m-a2", title: "Term 1 Mid-Term Test", type: "MID_TERM_TEST", term: "TERM_1",
        description: "Covers Numbers (Fractions & Decimals) and Measurement (Perimeter).",
        instructions: "Answer ALL questions. Show all working. Time allowed: 1 hour 30 minutes.",
        timeLimitMinutes: 90, totalMarks: 60,
        isAvailable: true, isSubmitted: false,
        questions: [
          makeQuestion("m-q4", "Calculate the perimeter of a rectangle 8 cm by 5 cm.", { type: "SHORT_ANSWER", correctAnswer: "26 cm", strand: "Measurement", marks: 4 }),
          makeQuestion("m-q5", "Arrange in ascending order: 0.3, 0.03, 0.33", { type: "SHORT_ANSWER", strand: "Numbers", marks: 3 }),
          makeQuestion("m-q6", "John has 3/8 of a pizza. Mary has 2/8. How much do they have together?", { type: "SHORT_ANSWER", correctAnswer: "5/8", strand: "Numbers", marks: 4 }),
        ],
      },
      {
        id: "m-a3", title: "Term 1 End-Term Exam", type: "END_TERM_EXAM", term: "TERM_1",
        description: "Comprehensive end-of-term examination. Contributes to CBA score.",
        instructions: "Answer ALL questions in Section A. Choose ONE question from Section B.",
        timeLimitMinutes: 120, totalMarks: 100,
        isAvailable: false, isSubmitted: false, questions: [],
      },
    ],
    liveClasses: [
      {
        id: "m-lc1", title: "Fractions — Live Revision with Ms. Akinyi",
        description: "Interactive session — bring your exercise books and questions!",
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 60, status: "SCHEDULED",
        meetingUrl: "https://meet.jit.si/daraja-math-grade5-t1",
        teacherName: "Ms. Akinyi Otieno", maxAttendees: 35, term: "TERM_1", subject: "Mathematics",
      },
      {
        id: "m-lc2", title: "Decimals Introduction — Live Class",
        description: "We'll work through 10 practice problems together.",
        scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 45, status: "ENDED",
        recordingUrl: "https://example.com/recording/m-lc2",
        teacherName: "Ms. Akinyi Otieno", attendees: 28, term: "TERM_1", subject: "Mathematics",
      },
    ],
    pastPapers: [
      { id: "m-pp1", title: "Mathematics Grade 5 Term 1 — 2023", year: 2023, term: "TERM_1", type: "SCHOOL", fileUrl: "#", addedAt: "2024-01-15", description: "End-term paper from Nairobi Primary." },
      { id: "m-pp2", title: "Mathematics Grade 5 Term 1 — 2022", year: 2022, term: "TERM_1", type: "SCHOOL", fileUrl: "#", addedAt: "2023-01-10" },
    ],
  },
  TERM_2: {
    term: "TERM_2",
    lessons: [
      makeLesson("m-l7",  "Geometry — Types of Angles", "Geometry",    1, { isLocked: true, durationMinutes: 20 }),
      makeLesson("m-l8",  "Measuring Angles",            "Geometry",    2, { isLocked: true, durationMinutes: 25 }),
      makeLesson("m-l9",  "Area of Rectangles",          "Measurement", 3, { isLocked: true, durationMinutes: 22 }),
      makeLesson("m-l10", "Time — 12 and 24 hour clock", "Measurement", 4, { isLocked: true, durationMinutes: 18 }),
      makeLesson("m-l11", "Data Handling — Tally Charts","Data",        5, { isLocked: true, durationMinutes: 30 }),
    ],
    assessments: [
      { id: "m-a4", title: "Geometry Quiz", type: "FORMATIVE_QUIZ", term: "TERM_2", description: "Quick check on angles and geometry basics.", timeLimitMinutes: 20, totalMarks: 30, isAvailable: false, isSubmitted: false, questions: [] },
      { id: "m-a5", title: "Term 2 Mid-Term Test", type: "MID_TERM_TEST", term: "TERM_2", description: "Geometry, Measurement and Data Handling.", timeLimitMinutes: 90, totalMarks: 60, isAvailable: false, isSubmitted: false, questions: [] },
      { id: "m-a6", title: "Term 2 End-Term Exam", type: "END_TERM_EXAM", term: "TERM_2", description: "Comprehensive examination for Term 2.", timeLimitMinutes: 120, totalMarks: 100, isAvailable: false, isSubmitted: false, questions: [] },
    ],
    liveClasses: [
      { id: "m-lc3", title: "Geometry — Angles Live Session", scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: "SCHEDULED", teacherName: "Ms. Akinyi Otieno", meetingUrl: "https://meet.jit.si/daraja-math-grade5-t2", maxAttendees: 35, term: "TERM_2", subject: "Mathematics" },
    ],
    pastPapers: [
      { id: "m-pp3", title: "Mathematics Grade 5 Term 2 — 2023", year: 2023, term: "TERM_2", type: "SCHOOL", fileUrl: "#", addedAt: "2024-07-10" },
      { id: "m-pp4", title: "Mathematics Grade 5 Term 2 — 2022", year: 2022, term: "TERM_2", type: "MOCK",   fileUrl: "#", addedAt: "2023-07-05" },
    ],
  },
  TERM_3: {
    term: "TERM_3",
    lessons: [
      makeLesson("m-l12", "Money and Financial Literacy", "Numbers",     1, { isLocked: true, durationMinutes: 25 }),
      makeLesson("m-l13", "Profit and Loss",               "Numbers",     2, { isLocked: true, durationMinutes: 20 }),
      makeLesson("m-l14", "Ratio and Proportion",          "Numbers",     3, { isLocked: true, durationMinutes: 22 }),
      makeLesson("m-l15", "Volume of Solids",              "Measurement", 4, { isLocked: true, durationMinutes: 30 }),
    ],
    assessments: [
      { id: "m-a7", title: "Money & Ratio Quiz", type: "FORMATIVE_QUIZ", term: "TERM_3", description: "Covers financial literacy and ratio concepts.", timeLimitMinutes: 20, totalMarks: 30, isAvailable: false, isSubmitted: false, questions: [] },
      { id: "m-a8", title: "Term 3 End-Term Exam", type: "END_TERM_EXAM", term: "TERM_3", description: "Final examination for the year. KNEC CBA component.", timeLimitMinutes: 120, totalMarks: 100, isAvailable: false, isSubmitted: false, questions: [] },
    ],
    liveClasses: [],
    pastPapers: [
      { id: "m-pp5", title: "Mathematics Grade 5 Term 3 — 2023", year: 2023, term: "TERM_3", type: "SCHOOL", fileUrl: "#", addedAt: "2024-11-01" },
      { id: "m-pp6", title: "KNEC Grade 5 Mock — 2022", year: 2022, term: "TERM_3", type: "KNEC", fileUrl: "#", addedAt: "2023-11-10", description: "Official KNEC-style mock paper." },
    ],
  },
};

// ─── English ────────────────────────────────────────────────────────────────

const ENGLISH_TERMS: Record<CBCTerm, TermBlock> = {
  TERM_1: {
    term: "TERM_1",
    lessons: [
      makeLesson("e-l1", "Listening & Speaking: Greetings and Introductions", "Listening & Speaking", 1, { isCompleted: true, contentType: "VIDEO", durationMinutes: 15, subStrand: "Oral Communication" }),
      makeLesson("e-l2", "Reading: The Lost Goat (Short Story)",              "Reading",              2, { isCompleted: true, contentType: "READING", durationMinutes: 20, subStrand: "Comprehension" }),
      makeLesson("e-l3", "Grammar: Nouns and Pronouns",                       "Grammar",              3, { isCompleted: false, contentType: "SLIDES", durationMinutes: 18, subStrand: "Word Classes" }),
      makeLesson("e-l4", "Writing: Composing a Simple Paragraph",             "Writing",              4, { isCompleted: false, contentType: "ACTIVITY", durationMinutes: 25, subStrand: "Guided Writing" }),
      makeLesson("e-l5", "Reading: Poem — 'The Rainy Season'",                "Reading",              5, { isCompleted: false, contentType: "READING", durationMinutes: 15, isLocked: true, subStrand: "Poetry" }),
    ],
    assessments: [
      {
        id: "e-a1", title: "Comprehension Check — The Lost Goat", type: "FORMATIVE_QUIZ", term: "TERM_1",
        description: "Short comprehension quiz on the Term 1 reading passage.",
        timeLimitMinutes: 15, totalMarks: 20, isAvailable: true, isSubmitted: true, score: 17, competencyLevel: "ME",
        questions: [
          makeQuestion("e-q1", "Who is the main character in 'The Lost Goat'?", { type: "SHORT_ANSWER", strand: "Reading", marks: 2 }),
          makeQuestion("e-q2", "Identify the noun in: 'The boy found the goat.'", { type: "MCQ", options: ["boy","found","the","in"], correctAnswer: "boy", strand: "Grammar", marks: 2 }),
        ],
      },
      { id: "e-a2", title: "Term 1 Mid-Term Test", type: "MID_TERM_TEST", term: "TERM_1", description: "Covers listening, reading comprehension and grammar.", timeLimitMinutes: 90, totalMarks: 60, isAvailable: true, isSubmitted: false, questions: [] },
      { id: "e-a3", title: "Term 1 End-Term Exam", type: "END_TERM_EXAM", term: "TERM_1", description: "Comprehensive end-of-term examination.", timeLimitMinutes: 120, totalMarks: 100, isAvailable: false, isSubmitted: false, questions: [] },
    ],
    liveClasses: [
      { id: "e-lc1", title: "Storytelling Circle — Live with Mr. Otieno", description: "Share and discuss short stories together.", scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, status: "SCHEDULED", meetingUrl: "https://meet.jit.si/daraja-english-grade5-t1", teacherName: "Mr. Otieno Kamau", maxAttendees: 35, term: "TERM_1", subject: "English" },
    ],
    pastPapers: [
      { id: "e-pp1", title: "English Grade 5 Term 1 — 2023", year: 2023, term: "TERM_1", type: "SCHOOL", fileUrl: "#", addedAt: "2024-01-15" },
    ],
  },
  TERM_2: {
    term: "TERM_2",
    lessons: [
      makeLesson("e-l6", "Grammar: Tenses — Past and Present", "Grammar", 1, { isLocked: true, durationMinutes: 20 }),
      makeLesson("e-l7", "Reading: Folktales of Kenya",        "Reading", 2, { isLocked: true, durationMinutes: 20 }),
      makeLesson("e-l8", "Writing: Letter Writing",            "Writing", 3, { isLocked: true, durationMinutes: 25 }),
    ],
    assessments: [
      { id: "e-a4", title: "Grammar Quiz — Tenses", type: "FORMATIVE_QUIZ", term: "TERM_2", description: "Quick check on past and present tense usage.", timeLimitMinutes: 15, totalMarks: 20, isAvailable: false, isSubmitted: false, questions: [] },
      { id: "e-a5", title: "Term 2 End-Term Exam", type: "END_TERM_EXAM", term: "TERM_2", description: "Comprehensive examination for Term 2.", timeLimitMinutes: 120, totalMarks: 100, isAvailable: false, isSubmitted: false, questions: [] },
    ],
    liveClasses: [],
    pastPapers: [
      { id: "e-pp2", title: "English Grade 5 Term 2 — 2023", year: 2023, term: "TERM_2", type: "SCHOOL", fileUrl: "#", addedAt: "2024-07-10" },
    ],
  },
  TERM_3: {
    term: "TERM_3",
    lessons: [
      makeLesson("e-l9", "Writing: Formal and Informal Letters", "Writing", 1, { isLocked: true, durationMinutes: 25 }),
      makeLesson("e-l10", "Reading: Novel Study Introduction",   "Reading", 2, { isLocked: true, durationMinutes: 30 }),
    ],
    assessments: [
      { id: "e-a6", title: "Term 3 End-Term Exam", type: "END_TERM_EXAM", term: "TERM_3", description: "Final examination for the year.", timeLimitMinutes: 120, totalMarks: 100, isAvailable: false, isSubmitted: false, questions: [] },
    ],
    liveClasses: [],
    pastPapers: [],
  },
};

// ─── Kiswahili ──────────────────────────────────────────────────────────────

const KISWAHILI_TERMS: Record<CBCTerm, TermBlock> = {
  TERM_1: {
    term: "TERM_1",
    lessons: [
      makeLesson("k-l1", "Kusikiliza na Kuzungumza: Salamu",  "Kusikiliza na Kuzungumza", 1, { isCompleted: true, durationMinutes: 15, subStrand: "Mazungumzo" }),
      makeLesson("k-l2", "Kusoma: Hadithi — Sungura na Kobe",  "Kusoma",                   2, { isCompleted: false, contentType: "READING", durationMinutes: 20, subStrand: "Ufahamu" }),
      makeLesson("k-l3", "Sarufi: Nomino na Viwakilishi",      "Sarufi",                   3, { isCompleted: false, contentType: "SLIDES", durationMinutes: 18, subStrand: "Aina za Maneno" }),
    ],
    assessments: [
      { id: "k-a1", title: "Jaribio la Ufahamu — Sungura na Kobe", type: "FORMATIVE_QUIZ", term: "TERM_1", description: "Jaribio fupi la ufahamu wa hadithi.", timeLimitMinutes: 15, totalMarks: 20, isAvailable: true, isSubmitted: false, questions: [] },
      { id: "k-a2", title: "Mtihani wa Muhula wa Kwanza", type: "END_TERM_EXAM", term: "TERM_1", description: "Mtihani kamili wa muhula wa kwanza.", timeLimitMinutes: 120, totalMarks: 100, isAvailable: false, isSubmitted: false, questions: [] },
    ],
    liveClasses: [],
    pastPapers: [
      { id: "k-pp1", title: "Kiswahili Darasa la 5 Muhula 1 — 2023", year: 2023, term: "TERM_1", type: "SCHOOL", fileUrl: "#", addedAt: "2024-01-15" },
    ],
  },
  TERM_2: {
    term: "TERM_2",
    lessons: [
      makeLesson("k-l4", "Sarufi: Vitenzi", "Sarufi", 1, { isLocked: true, durationMinutes: 20 }),
    ],
    assessments: [],
    liveClasses: [],
    pastPapers: [],
  },
  TERM_3: {
    term: "TERM_3",
    lessons: [],
    assessments: [],
    liveClasses: [],
    pastPapers: [],
  },
};

// ─── Science & Technology ──────────────────────────────────────────────────

const SCIENCE_TERMS: Record<CBCTerm, TermBlock> = {
  TERM_1: {
    term: "TERM_1",
    lessons: [
      makeLesson("s-l1", "Living Things: Classification of Animals", "Living Things", 1, { isCompleted: true, durationMinutes: 20, subStrand: "Animal Kingdom" }),
      makeLesson("s-l2", "Photosynthesis in Plants",                 "Living Things", 2, { isCompleted: false, contentType: "VIDEO", durationMinutes: 18, subStrand: "Plant Life" }),
      makeLesson("s-l3", "Simple Machines — Levers and Pulleys",     "Force & Energy", 3, { isCompleted: false, contentType: "ACTIVITY", durationMinutes: 25, isLocked: true, subStrand: "Machines" }),
    ],
    assessments: [
      { id: "s-a1", title: "Living Things Quick Check", type: "FORMATIVE_QUIZ", term: "TERM_1", description: "Quiz on animal and plant classification.", timeLimitMinutes: 15, totalMarks: 20, isAvailable: true, isSubmitted: true, score: 18, competencyLevel: "EE", questions: [] },
      { id: "s-a2", title: "Term 1 End-Term Exam", type: "END_TERM_EXAM", term: "TERM_1", description: "Comprehensive end-of-term examination.", timeLimitMinutes: 120, totalMarks: 100, isAvailable: false, isSubmitted: false, questions: [] },
    ],
    liveClasses: [
      { id: "s-lc1", title: "Science Lab Live — Simple Machines Demo", description: "Watch a live demonstration of levers and pulleys.", scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 40, status: "SCHEDULED", meetingUrl: "https://meet.jit.si/daraja-science-grade5-t1", teacherName: "Mr. Mwangi Njoroge", maxAttendees: 35, term: "TERM_1", subject: "Science & Technology" },
    ],
    pastPapers: [
      { id: "s-pp1", title: "Science & Technology Grade 5 Term 1 — 2023", year: 2023, term: "TERM_1", type: "SCHOOL", fileUrl: "#", addedAt: "2024-01-15" },
    ],
  },
  TERM_2: {
    term: "TERM_2",
    lessons: [
      makeLesson("s-l4", "The Water Cycle", "Earth & Space", 1, { isLocked: true, durationMinutes: 20 }),
    ],
    assessments: [],
    liveClasses: [],
    pastPapers: [],
  },
  TERM_3: {
    term: "TERM_3",
    lessons: [],
    assessments: [],
    liveClasses: [],
    pastPapers: [],
  },
};

// ─── Social Studies ─────────────────────────────────────────────────────────

const SOCIAL_STUDIES_TERMS: Record<CBCTerm, TermBlock> = {
  TERM_1: {
    term: "TERM_1",
    lessons: [
      makeLesson("ss-l1", "Our Country Kenya: Counties and Regions", "Citizenship", 1, { isCompleted: true, durationMinutes: 20, subStrand: "National Identity" }),
      makeLesson("ss-l2", "Map Reading Basics",                       "Geography",   2, { isCompleted: false, contentType: "SLIDES", durationMinutes: 18, subStrand: "Maps" }),
    ],
    assessments: [
      { id: "ss-a1", title: "Counties Quick Check", type: "FORMATIVE_QUIZ", term: "TERM_1", description: "Quiz on Kenyan counties and regions.", timeLimitMinutes: 15, totalMarks: 20, isAvailable: true, isSubmitted: false, questions: [] },
    ],
    liveClasses: [],
    pastPapers: [
      { id: "ss-pp1", title: "Social Studies Grade 5 Term 1 — 2023", year: 2023, term: "TERM_1", type: "SCHOOL", fileUrl: "#", addedAt: "2024-01-15" },
    ],
  },
  TERM_2: { term: "TERM_2", lessons: [], assessments: [], liveClasses: [], pastPapers: [] },
  TERM_3: { term: "TERM_3", lessons: [], assessments: [], liveClasses: [], pastPapers: [] },
};

// ─── Creative Arts ──────────────────────────────────────────────────────────

const CREATIVE_ARTS_TERMS: Record<CBCTerm, TermBlock> = {
  TERM_1: {
    term: "TERM_1",
    lessons: [
      makeLesson("ca-l1", "Colour Theory: Primary and Secondary Colours", "Visual Arts", 1, { isCompleted: true, contentType: "VIDEO", durationMinutes: 15, subStrand: "Colour" }),
      makeLesson("ca-l2", "Rhythm and Beat in Music",                     "Music",       2, { isCompleted: false, contentType: "ACTIVITY", durationMinutes: 20, subStrand: "Rhythm" }),
    ],
    assessments: [
      { id: "ca-a1", title: "Colour Theory Quick Check", type: "FORMATIVE_QUIZ", term: "TERM_1", description: "Short quiz on primary and secondary colours.", timeLimitMinutes: 10, totalMarks: 15, isAvailable: true, isSubmitted: false, questions: [] },
    ],
    liveClasses: [],
    pastPapers: [],
  },
  TERM_2: { term: "TERM_2", lessons: [], assessments: [], liveClasses: [], pastPapers: [] },
  TERM_3: { term: "TERM_3", lessons: [], assessments: [], liveClasses: [], pastPapers: [] },
};

// ─── Library keyed by normalized subject name ──────────────────────────────

const SUBJECT_CONTENT_LIBRARY: Record<string, Record<CBCTerm, TermBlock>> = {
  "mathematics":            MATHEMATICS_TERMS,
  "english":                ENGLISH_TERMS,
  "kiswahili":              KISWAHILI_TERMS,
  "science-technology":     SCIENCE_TERMS,
  "science":                SCIENCE_TERMS,
  "social-studies":         SOCIAL_STUDIES_TERMS,
  "creative-arts":          CREATIVE_ARTS_TERMS,
};

/** Normalizes a subject name into a lookup key, e.g. "Science & Technology" -> "science-technology" */
function slugifySubjectName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

function resolveTermsForSubject(name: string): Record<CBCTerm, TermBlock> {
  const key = slugifySubjectName(name);
  if (SUBJECT_CONTENT_LIBRARY[key]) return SUBJECT_CONTENT_LIBRARY[key];
  // Partial match fallback, e.g. "Science & Technology (Practical)" -> "science-technology"
  const partial = Object.keys(SUBJECT_CONTENT_LIBRARY).find(
    (libKey) => key.includes(libKey) || libKey.includes(key)
  );
  if (partial) return SUBJECT_CONTENT_LIBRARY[partial];
  return DEFAULT_TERMS;
}

// ─── Public API ─────────────────────────────────────────────────────────────

export type SubjectMeta = {
  id: string;
  name: string;
  icon: string;
  color: string;
  grade: string;
  description?: string;
};

/**
 * Builds a full Subject (metadata + term content) from a real subject row
 * (fetched via your existing `getAllSubjects` server action) merged with
 * mock term content looked up by subject name.
 *
 * Replace the SUBJECT_CONTENT_LIBRARY entries with real Prisma queries per
 * subject as you author that content — the shape stays identical.
 */
export function buildSubjectContent(meta: SubjectMeta): Subject {
  const terms = resolveTermsForSubject(meta.name);
  const hasContent = terms !== DEFAULT_TERMS;

  return {
    id: meta.id,
    name: meta.name,
    grade: meta.grade as Subject["grade"],
    icon: meta.icon,
    color: meta.color,
    description:
      meta.description ??
      (hasContent
        ? undefined
        : `Content for ${meta.name} is being added — check back soon.`),
    terms: [terms.TERM_1, terms.TERM_2, terms.TERM_3],
    progressPercentage: hasContent
      ? Math.round(
          (terms.TERM_1.lessons.filter((l) => l.isCompleted).length /
            Math.max(terms.TERM_1.lessons.length, 1)) *
            100
        )
      : 0,
  };
}

/**
 * @deprecated Kept only so nothing else importing the old name breaks at
 * build time. Always returned hardcoded Mathematics data regardless of id —
 * this was the bug. Use `buildSubjectContent(meta)` with a real subject row
 * from `getAllSubjects` instead.
 */
export function getMockSubject(id: string): Subject {
  return buildSubjectContent({
    id,
    name: "Mathematics",
    icon: "Calculator",
    color: "#f59e0b",
    grade: "GRADE_5",
  });
}
