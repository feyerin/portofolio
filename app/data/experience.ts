
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
    company: "BookingToGo.com",
    period: "Dec 2025 — Present",
    type: "Current Chapter",
    summary:
      "Building and refining travel booking experiences, from production improvements and seasonal campaigns to responsive redesigns across the BookingToGo platform.",
    contributions: [
      "Maintained and improved production systems by identifying and resolving bugs, ensuring a reliable and seamless user experience.",
      "Engineered a custom wheel picker for date selection, delivering a tailored interaction beyond standard library solutions.",
      "Designed and developed promotional sections for hotel, flight, and train bookings across major campaigns, including Lunar New Year, Pay Day, and Ramadan.",
      "Built SEO-focused landing pages to strengthen organic visibility and search performance.",
      "Refactored and optimized legacy code to improve maintainability, performance, scalability, and overall architecture.",
      "Implemented the website redesign across desktop, tablet, and mobile, ensuring a responsive and consistent experience.",
    ],
    current: true,
  },
  {
    role: "Frontend Developer / Project Manager",
    company: "PT. Kreasi Digital Indo Utama",
    period: "Jan 2022 — Dec 2025",
    type: "Previous Chapter",
    summary:
      "Led digital projects from planning to delivery, bridging client needs, design, and engineering while crafting web applications and automation tools.",
    contributions: [
      "Led end-to-end software development projects, coordinating design, frontend, backend, and QA teams to deliver quality work on schedule.",
      "Served as the primary liaison between clients and technical teams, gathering requirements, defining milestones, and tracking project progress.",
      "Defined project scope, established delivery timelines, and monitored deadlines and budgets.",
      "Built responsive interfaces using semantic HTML5, modern CSS, and media queries, collaborating with UI/UX designers through Figma.",
      "Identified and resolved bugs while improving application stability, performance, and scalability.",
      "Developed and maintained React.js projects, including idzx.org, Baresto.id, and Geekportal.co.id.",
      "Built custom TikTok and Shopee web-scraping bots using Puppeteer, Playwright, and API inspection to automate data collection.",
      "Used GitHub, GitLab, and Bitbucket to manage source control and support team collaboration.",
    ],
    current: false,
  },
  {
    role: "Frontend Developer",
    company: "Ultimo Solution",
    period: "Jun 2020 — Nov 2021",
    type: "Earlier Chapter",
    summary:
      "Crafted practical web solutions for business operations, spanning wedding management, invitation generation, shipping management, and marketplace administration.",
    contributions: [
      "Developed client websites and applications for wedding management with automated invitation generation, shipping management, and marketplace admin dashboards.",
      "Built interfaces using HTML5, CSS3, and jQuery to support business workflows and user interactions.",
      "Integrated frontend applications with backend services using AJAX and the Fetch API.",
      "Wrote clean, documented, and maintainable code while following established coding standards and best practices.",
      "Implemented lazy loading for images and other resources to improve page loading performance.",
    ],
    current: false,
  },
  {
    role: "Frontend Developer",
    company: "PT. Anterin Digital Nusantara",
    period: "Nov 2019 — Jun 2020",
    type: "The Beginning",
    summary:
      "Began the journey of crafting responsive web experiences and internal management dashboards, building a strong foundation in frontend engineering.",
    contributions: [
      "Created responsive and visually consistent web interfaces using HTML, CSS, and JavaScript.",
      "Collaborated with UI/UX designers using Figma to translate designs into technically feasible, performant interfaces.",
      "Developed internal management dashboards using Vue.js and React.js.",
      "Identified and resolved bugs and performance issues to improve application reliability.",
      "Applied CSS Flexbox and Grid to build flexible layouts across different screen sizes.",
      "Used GitHub, GitLab, and Bitbucket for version control and collaboration with fellow developers.",
    ],
    current: false,
  },
];

