
export interface WorkExperience {
  role: string;
  company: string;
  period: string;
  type: string;
  summary: string;
  contributions: string[];
  current?: boolean;
}

export const experiences: WorkExperience[] = [
  {
    role: "Frontend Developer",
    company: "Current Company",
    period: "Present",
    type: "Professional Experience",
    summary:
      "Developing and maintaining web experiences across travel booking and promotional journeys.",
    contributions: [
      "Maintained existing website features and resolved bugs to improve application reliability.",
      "Built a custom wheel picker from scratch for the website datepicker.",
      "Developed promotional sections for hotel, flight, and train products during seasonal campaigns.",
      "Built SEO-focused pages and refactored existing code to improve maintainability.",
    ],
    current: true,
  },
];
