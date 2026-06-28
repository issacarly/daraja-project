// types/subject.ts
// Single source of truth for all subject-module types in Daraja.
// Aligns with CBC Kenya structure: 3 terms, formative + summative assessments,
// competency levels (BE / AE / ME / EE), and live class hosting.

// ─── CBC Constants ────────────────────────────────────────────────────────────

export const CBC_TERMS = ["TERM_1", "TERM_2", "TERM_3"] as const;
export type CBCTerm = typeof CBC_TERMS[number];

export const TERM_LABELS: Record<CBCTerm, string> = {
  TERM_1: "Term 1",
  TERM_2: "Term 2",
  TERM_3: "Term 3",
};

export const COMPETENCY_LEVELS = ["BE", "AE", "ME", "EE"] as const;
export type CompetencyLevel = typeof COMPETENCY_LEVELS[number];

export const COMPETENCY_META: Record<CompetencyLevel, {
  label: string; color: string; bg: string; description: string; numeric: number;
}> = {
  BE: { label: "Below Expectation",       color: "#ef4444", bg: "rgba(239,68,68,0.1)",    description: "Needs targeted support and intervention.",                                    numeric: 1 },
  AE: { label: "Approaching Expectation", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",   description: "Developing — benefits from scaffolding.",                                    numeric: 2 },
  ME: { label: "Meeting Expectation",     color: "#0ea5e9", bg: "rgba(14,165,233,0.1)",   description: "Achieved the competency at grade level.",                                    numeric: 3 },
  EE: { label: "Exceeding Expectation",   color: "#10b981", bg: "rgba(16,185,129,0.1)",   description: "Applies skills independently in unfamiliar contexts; may mentor peers.",     numeric: 4 },
};

export type AssessmentType =
  | "FORMATIVE_QUIZ"       // short in-lesson check
  | "MID_TERM_TEST"        // summative, mid-term
  | "END_TERM_EXAM"        // summative, end of term
  | "PAST_PAPER"           // archived KNEC / school past paper
  | "PROJECT"              // CBC portfolio/project submission
  | "PRACTICAL";           // lab / creative practical

export type LessonContentType = "VIDEO" | "PDF" | "SLIDES" | "READING" | "ACTIVITY";

export type LiveClassStatus = "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED";

// ─── Core Data Models ─────────────────────────────────────────────────────────

export interface Subject {
  id: string;
  name: string;
  grade: string;          // e.g. "GRADE_5"
  icon: string;           // Lucide icon name
  color: string;          // hex
  description?: string;
  terms: TermBlock[];
  progressPercentage: number;
}

export interface TermBlock {
  term: CBCTerm;
  lessons: Lesson[];
  assessments: Assessment[];
  liveClasses: LiveClass[];
  pastPapers: PastPaper[];
}

export interface Lesson {
  id: string;
  title: string;
  strand: string;         // CBC strand name
  subStrand?: string;
  contentType: LessonContentType;
  videoUrl?: string;      // YouTube embed / direct
  pdfUrl?: string;
  slidesUrl?: string;
  readingContent?: string; // rich text / MDX
  durationMinutes?: number;
  order: number;
  isCompleted: boolean;
  isLocked: boolean;
  completedAt?: string;
  thumbnailUrl?: string;
  notes?: string;         // teacher notes for this lesson
}

export interface Assessment {
  id: string;
  title: string;
  type: AssessmentType;
  term: CBCTerm;
  description?: string;
  instructions?: string;
  timeLimitMinutes?: number;
  totalMarks: number;
  questions: Question[];
  dueDate?: string;
  submittedAt?: string;
  score?: number;          // raw score
  competencyLevel?: CompetencyLevel; // derived from score
  isAvailable: boolean;
  isSubmitted: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: "MCQ" | "SHORT_ANSWER" | "ESSAY" | "TRUE_FALSE" | "FILL_BLANK";
  options?: string[];      // MCQ options
  correctAnswer?: string;  // for auto-marking
  marks: number;
  imageUrl?: string;       // question image
  explanation?: string;    // shown after submission
  strand?: string;         // which CBC strand this tests
}

export interface PastPaper {
  id: string;
  title: string;
  year: number;
  term: CBCTerm;
  type: "SCHOOL" | "KNEC" | "MOCK";
  fileUrl: string;
  thumbnailUrl?: string;
  description?: string;
  addedAt: string;
}

export interface LiveClass {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;     // ISO datetime
  durationMinutes: number;
  status: LiveClassStatus;
  meetingUrl?: string;     // Jitsi / Google Meet / Zoom URL
  teacherName: string;
  recordingUrl?: string;   // available after class ends
  attendees?: number;
  maxAttendees?: number;
  subject: string;
  term: CBCTerm;
}

// ─── Progress & Portfolio ─────────────────────────────────────────────────────

export interface StudentProgress {
  subjectId: string;
  lessonsCompleted: number;
  totalLessons: number;
  assessmentsTaken: number;
  totalAssessments: number;
  overallCompetency: CompetencyLevel;
  strandProgress: StrandProgress[];
  termSummaries: TermSummary[];
}

export interface StrandProgress {
  strand: string;
  competencyLevel: CompetencyLevel;
  lessonsCompleted: number;
  totalLessons: number;
}

export interface TermSummary {
  term: CBCTerm;
  midTermScore?: number;
  endTermScore?: number;
  competencyLevel?: CompetencyLevel;
  lessonsCompleted: number;
  totalLessons: number;
}

// ─── Tab Navigation ───────────────────────────────────────────────────────────

export type SubjectTab = "overview" | "lessons" | "assessments" | "past-papers" | "live-classes";

export const SUBJECT_TABS: { id: SubjectTab; label: string; icon: string }[] = [
  { id: "overview",      label: "Overview",     icon: "LayoutDashboard" },
  { id: "lessons",       label: "Lessons",      icon: "BookOpen"        },
  { id: "assessments",   label: "Assessments",  icon: "ClipboardList"   },
  { id: "past-papers",   label: "Past Papers",  icon: "FileText"        },
  { id: "live-classes",  label: "Live Classes", icon: "Video"           },
];
