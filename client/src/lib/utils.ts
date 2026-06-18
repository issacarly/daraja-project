import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function gradeLabel(grade: string) {
  return grade.replace("_", " ");
}

export function termLabel(term: string) {
  return term.replace("_", " ");
}
