
export interface PortfolioProject {
  number: string;
  name: string;
  category: string;
  year: string;
  stack: string[];
  description: string;
  className: string;
  href?: string;
}

export const projects: PortfolioProject[] = [
  {
    number: "01",
    name: "BookingToGo",
    category: "TRAVEL / BOOKING",
    year: "WEB PLATFORM",
    stack: ["Nuxt", "Vue", "TypeScript"],
    description:
      "A travel booking platform featuring hotel, flight, and train experiences, seasonal promotional campaigns, and SEO-focused pages.",
    className: "project-bookingtogo",
    href: "https://bookingtogo.com"
  },
  {
    number: "02",
    name: "Caroline",
    category: "AUTOMOTIVE",
    year: "WEB EXPERIENCE",
    stack: ["Next.js", "React"],
    description:
      "An automotive digital experience developed with a focus on modern frontend technologies and a structured user interface.",
    className: "project-caroline",
    href: "https://www.caroline.id"
  },
  {
    number: "03",
    name: "Kalbe",
    category: "CORPORATE",
    year: "DIGITAL PRESENCE",
    stack: ["Next.js", "React"],
    description:
      "A corporate digital experience built with modern frontend technologies and a focus on clear content presentation.",
    className: "project-kalbe",
    href: "https://www.kalbe.co.id"
  },
];
