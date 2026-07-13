export const HELP_CATEGORIES = [
  { value: "TECHNICAL_ISSUE", label: "Technical issue (app not working)" },
  { value: "LOGIN_ACCOUNT", label: "Login or account problem" },
  { value: "CURRICULUM_CONTENT", label: "Curriculum or lesson content" },
  { value: "ASSESSMENT_GRADING", label: "Assessment or grading question" },
  { value: "PAYMENT_BILLING", label: "Payment or billing" },
  { value: "BUG_REPORT", label: "Something looks broken" },
  { value: "OTHER", label: "Something else" },
] as const;

export type HelpCategoryValue = typeof HELP_CATEGORIES[number]["value"];
