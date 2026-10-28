export type Skill = {
  id: string
  name: string
  symbol: string
  type: string
  description: string
  technologies: string[]
}

export type Branch = {
  id: string
  number: string
  title: string
  subtitle: string
  emblem: string
  skills: Skill[]
}

export const skillTree: Branch[] = [
  {
    id: "arcane",
    number: "I",
    title: "Arcane Engineering",
    subtitle: "The art of building",
    emblem: "✧",
    skills: [
      {
        id: "html",
        name: "HTML",
        symbol: "H",
        type: "CORE SKILL",
        description:
          "Building semantic, accessible foundations for modern web applications.",
        technologies: ["Semantic HTML", "Forms", "SEO"],
      },
      {
        id: "css",
        name: "CSS",
        symbol: "C",
        type: "CORE SKILL",
        description:
          "Creating polished interfaces with modern layouts, responsive styling, and animations.",
        technologies: ["Flexbox", "Grid", "Animations", "Custom Properties"],
      },
      {
        id: "javascript",
        name: "JavaScript",
        symbol: "JS",
        type: "CORE SKILL",
        description:
          "Building dynamic web experiences with modern JavaScript and asynchronous programming.",
        technologies: ["ES6+", "Async/Await", "Promises", "DOM"],
      },
      {
        id: "typescript",
        name: "TypeScript",
        symbol: "TS",
        type: "CORE SKILL",
        description:
          "Writing type-safe applications with predictable data structures and maintainable code.",
        technologies: ["Interfaces", "Generics", "Type Inference"],
      },
      {
        id: "vue",
        name: "Vue.js",
        symbol: "V",
        type: "CORE SKILL",
        description:
          "Building reactive interfaces using reusable components and Vue's Composition API.",
        technologies: ["Vue 3", "Composition API", "Reactivity"],
      },
      {
        id: "nuxt",
        name: "Nuxt",
        symbol: "N",
        type: "CORE SKILL",
        description:
          "Developing full-featured Vue applications with file-based routing, SSR, and composables.",
        technologies: ["Nuxt 3/4", "SSR", "File-based Routing"],
      },
      {
        id: "react",
        name: "React",
        symbol: "R",
        type: "ACTIVE SKILL",
        description:
          "Developing interactive interfaces through component composition, hooks, and reactive state.",
        technologies: ["React", "Hooks", "JSX"],
      },
      {
        id: "next",
        name: "Next.js",
        symbol: "N",
        type: "ACTIVE SKILL",
        description:
          "Building React applications with modern routing, server rendering, and full-stack capabilities.",
        technologies: ["Next.js", "App Router", "Server Components"],
      },
      {
        id: "state-management",
        name: "State Management",
        symbol: "S",
        type: "CORE SKILL",
        description:
          "Managing shared application state, derived values, and predictable UI updates across components.",
        technologies: ["Pinia", "Vue Reactivity", "React Context", "Zustand"],
      },
      {
        id: "data-fetching",
        name: "Data Fetching",
        symbol: "DF",
        type: "ACTIVE SKILL",
        description:
          "Managing asynchronous data, loading states, caching, and synchronization with remote services.",
        technologies: ["useFetch", "TanStack Query", "SWR", "Async/Await"],
      },
      {
        id: "routing",
        name: "Routing",
        symbol: "R",
        type: "ACTIVE SKILL",
        description:
          "Structuring navigation, dynamic routes, nested layouts, and route-based application behavior.",
        technologies: ["Vue Router", "Nuxt Routing", "React Router"],
      },
      {
        id: "forms",
        name: "Form Management",
        symbol: "F",
        type: "ACTIVE SKILL",
        description:
          "Building reliable forms with validation, reusable inputs, and clear error handling.",
        technologies: ["VeeValidate", "Zod", "Yup", "Form Validation"],
      },
    ],
  },
  {
    id: "artificer",
    number: "II",
    title: "Artificer's Craft",
    subtitle: "The craft of interfaces",
    emblem: "⚒",
    skills: [
      {
        id: "tailwind",
        name: "Tailwind CSS",
        symbol: "T",
        type: "CORE SKILL",
        description:
          "Building consistent and responsive interfaces with utility-first styling.",
        technologies: ["Tailwind CSS", "Responsive Utilities", "Design Tokens"],
      },
      {
        id: "responsive",
        name: "Responsive Design",
        symbol: "↔",
        type: "CORE SKILL",
        description:
          "Adapting layouts and interactions to different screen sizes and device capabilities.",
        technologies: ["Mobile-first", "Breakpoints", "Adaptive Layouts"],
      },
      {
        id: "component-architecture",
        name: "Component Architecture",
        symbol: "⌘",
        type: "CORE SKILL",
        description:
          "Designing reusable, composable components with clear responsibilities and consistent interfaces.",
        technologies: ["Component Design", "Composition", "Design Systems"],
      },
      {
        id: "ui-ux",
        name: "UI/UX Fundamentals",
        symbol: "U",
        type: "ACTIVE SKILL",
        description:
          "Translating user needs and interface designs into intuitive, consistent user experiences.",
        technologies: ["Usability", "Visual Hierarchy", "Interaction Design"],
      },
      {
        id: "accessibility",
        name: "Web Accessibility",
        symbol: "A",
        type: "ACTIVE SKILL",
        description:
          "Making interfaces usable through keyboard navigation, semantic markup, and assistive technologies.",
        technologies: ["ARIA", "Keyboard Navigation", "WCAG"],
      },
      {
        id: "animation",
        name: "UI Animation",
        symbol: "✧",
        type: "ACTIVE SKILL",
        description:
          "Creating meaningful transitions and interactions that improve feedback and user experience.",
        technologies: ["CSS Transitions", "Keyframes", "Motion"],
      },
      {
        id: "design-systems",
        name: "Design Systems",
        symbol: "D",
        type: "ACTIVE SKILL",
        description:
          "Maintaining visual consistency through shared components, design tokens, and reusable patterns.",
        technologies: ["Component Libraries", "Design Tokens", "Theming"],
      },
      {
        id: "figma",
        name: "Figma Handoff",
        symbol: "F",
        type: "ACTIVE SKILL",
        description:
          "Translating design specifications into accurate layouts, spacing, typography, and responsive behavior.",
        technologies: ["Design Inspection", "Auto Layout", "Developer Handoff"],
      },
      {
        id: "scss",
        name: "CSS Architecture",
        symbol: "#",
        type: "ACTIVE SKILL",
        description:
          "Organizing styles for scalability, consistency, and long-term maintainability.",
        technologies: ["SCSS", "BEM", "CSS Modules"],
      },
      {
        id: "web-semantics",
        name: "Semantic UI Patterns",
        symbol: "S",
        type: "FIELD EXPERIENCE",
        description:
          "Choosing appropriate interface patterns for navigation, dialogs, dropdowns, and interactive controls.",
        technologies: ["Dialogs", "Dropdowns", "Interactive Components"],
      },
    ],
  },
  {
    id: "adventurer",
    number: "III",
    title: "Adventurer's Toolkit",
    subtitle: "The discipline of delivery",
    emblem: "⚔",
    skills: [
      {
        id: "git",
        name: "Git & Version Control",
        symbol: "G",
        type: "CORE SKILL",
        description:
          "Tracking changes, collaborating with teams, and maintaining reliable development workflows.",
        technologies: ["Git", "GitHub", "Branching", "Pull Requests"],
      },
      {
        id: "api",
        name: "REST API Integration",
        symbol: "{ }",
        type: "CORE SKILL",
        description:
          "Connecting frontend applications to backend services and handling asynchronous responses.",
        technologies: ["HTTP", "REST", "JSON", "Fetch API"],
      },
      {
        id: "testing",
        name: "Frontend Testing",
        symbol: "✓",
        type: "ACTIVE SKILL",
        description:
          "Verifying component behavior, application logic, and critical user journeys with automated tests.",
        technologies: ["Vitest", "Vue Test Utils", "Playwright"],
      },
      {
        id: "debugging",
        name: "Debugging",
        symbol: "⌕",
        type: "FIELD EXPERIENCE",
        description:
          "Investigating runtime errors, network failures, rendering issues, and unexpected application behavior.",
        technologies: ["Browser DevTools", "Network Inspection", "Error Analysis"],
      },
      {
        id: "performance",
        name: "Web Performance",
        symbol: "ϟ",
        type: "ACTIVE SKILL",
        description:
          "Improving load times, rendering efficiency, and responsiveness through performance analysis.",
        technologies: ["Core Web Vitals", "Lazy Loading", "Code Splitting"],
      },
      {
        id: "refactoring",
        name: "Code Quality",
        symbol: "↻",
        type: "FIELD EXPERIENCE",
        description:
          "Improving readability, consistency, and maintainability while preserving application behavior.",
        technologies: ["Refactoring", "ESLint", "Prettier"],
      },
      {
        id: "deployment",
        name: "Build & Deployment",
        symbol: "▲",
        type: "ACTIVE SKILL",
        description:
          "Preparing production builds, managing environment configuration, and deploying frontend applications.",
        technologies: ["Vite", "CI/CD", "Environment Variables", "Vercel"],
      },
      {
        id: "seo",
        name: "SEO & Web Fundamentals",
        symbol: "◎",
        type: "ACTIVE SKILL",
        description:
          "Improving discoverability, metadata, and indexing for public-facing web applications.",
        technologies: ["Meta Tags", "Structured Data", "Sitemap", "Robots.txt"],
      },
      {
        id: "collaboration",
        name: "Team Collaboration",
        symbol: "⌘",
        type: "FIELD EXPERIENCE",
        description:
          "Working effectively within development teams through clear communication, code reviews, and shared conventions.",
        technologies: ["Code Reviews", "Agile", "Issue Tracking"],
      },
    ],
  },
];
