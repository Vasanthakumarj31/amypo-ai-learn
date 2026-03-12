export interface Lesson {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface Level {
  name: string;
  lessons: Lesson[];
  progress: number;
}

export interface Course {
  id: string;
  title: string;
  icon: string;
  levels: Level[];
}

const makeLessons = (prefix: string, titles: string[]): Lesson[] =>
  titles.map((title, i) => ({
    id: `${prefix}-${i}`,
    title,
    description: `Learn about ${title.toLowerCase()} in depth.`,
    completed: Math.random() > 0.6,
  }));

export const courses: Course[] = [
  {
    id: "html",
    title: "HTML",
    icon: "🟧",
    levels: [
      {
        name: "Beginner",
        progress: 75,
        lessons: makeLessons("html-b", [
          "Document Structure",
          "Headings & Paragraphs",
          "Links & Images",
          "Lists",
          "Tables",
          "Forms Basics",
          "Semantic HTML",
          "Metadata",
        ]),
      },
      {
        name: "Intermediate",
        progress: 40,
        lessons: makeLessons("html-i", [
          "Form Validation",
          "Media Elements",
          "Canvas Intro",
          "SVG Basics",
          "Accessibility",
          "SEO Fundamentals",
        ]),
      },
      {
        name: "Advanced",
        progress: 10,
        lessons: makeLessons("html-a", [
          "Web Components",
          "Shadow DOM",
          "Custom Elements",
          "Template & Slot",
          "Progressive Enhancement",
        ]),
      },
    ],
  },
  {
    id: "css",
    title: "CSS",
    icon: "🟦",
    levels: [
      {
        name: "Beginner",
        progress: 60,
        lessons: makeLessons("css-b", [
          "Selectors",
          "Box Model",
          "Colors & Backgrounds",
          "Typography",
          "Display & Position",
          "Flexbox",
          "Units & Sizing",
        ]),
      },
      {
        name: "Intermediate",
        progress: 25,
        lessons: makeLessons("css-i", [
          "Grid Layout",
          "Transitions",
          "Animations",
          "Responsive Design",
          "Media Queries",
          "Variables",
          "Pseudo Elements",
        ]),
      },
      {
        name: "Advanced",
        progress: 5,
        lessons: makeLessons("css-a", [
          "CSS Architecture",
          "Container Queries",
          "Subgrid",
          "Scroll Snap",
          "Blend Modes",
          "Houdini",
        ]),
      },
    ],
  },
  {
    id: "javascript",
    title: "JavaScript",
    icon: "🟨",
    levels: [
      {
        name: "Beginner",
        progress: 50,
        lessons: makeLessons("js-b", [
          "Variables & Types",
          "Operators",
          "Conditionals",
          "Loops",
          "Functions",
          "Arrays",
          "Objects",
          "String Methods",
        ]),
      },
      {
        name: "Intermediate",
        progress: 15,
        lessons: makeLessons("js-i", [
          "DOM Manipulation",
          "Events",
          "Async/Await",
          "Fetch API",
          "Error Handling",
          "ES6+ Features",
          "Modules",
          "Closures",
        ]),
      },
      {
        name: "Advanced",
        progress: 0,
        lessons: makeLessons("js-a", [
          "Design Patterns",
          "Web APIs",
          "Service Workers",
          "WebSockets",
          "Performance",
          "Testing",
        ]),
      },
    ],
  },
];
