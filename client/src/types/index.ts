export type Role = "STUDENT" | "GUARDIAN" | "TEACHER" | "ADMIN";

export type Grade =
  | "GRADE_1"
  | "GRADE_2"
  | "GRADE_3"
  | "GRADE_4"
  | "GRADE_5"
  | "GRADE_6"
  | "GRADE_7"
  | "GRADE_8"
  | "GRADE_9";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  createdAt?: string;
}

export interface Subject {
  id: string;
  name: string;
  grade: Grade;
  icon?: string;
  color?: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  grade: Grade;
  term: "TERM_1" | "TERM_2" | "TERM_3";
  subject: Subject;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  timeLimit?: number;
  courseId: string;
}
