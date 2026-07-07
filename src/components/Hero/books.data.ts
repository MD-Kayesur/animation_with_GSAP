export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  total_copies: number;
  available_copies: number;
  description: string;
  color: string;
  cover: string;
  video: string;
  summary: string;
  isLoanedBook: boolean;
  pdfUrl: string;
}

export const DUMMY_BOOKS: Book[] = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Software Engineering",
    rating: 4.8,
    total_copies: 10,
    available_copies: 7,
    description:
      "A handbook of agile software craftsmanship. Learn to write clean, maintainable, and elegant code.",
    color: "#0d3b66",
    cover: "/images/covers/clean-code.png",
    video: "/Create_a_highly_realistic_cine (1).mp4",
    summary:
      "Clean Code: A Handbook of Agile Software Craftsmanship is a classic guide by Robert C. Martin ('Uncle Bob') that presents principles, patterns, and practices for writing clean, efficient, and maintainable software. It focuses on naming conventions, functions, comments, formatting, and unit testing to elevate software quality.",
    isLoanedBook: false,
    pdfUrl: "/pdf/clean-code.pdf",
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    genre: "Software Development",
    rating: 4.8,
    total_copies: 12,
    available_copies: 9,
    description:
      "Your journey to software mastery. Cuts through the complexities of modern development.",
    color: "#0f172a",
    cover: "/images/covers/pragmatic-programmer.png",
    video: "/Create_a_highly_realistic_cine (1).mp4",
    summary:
      "The Pragmatic Programmer is one of the most highly acclaimed programming books ever written. It offers timeless advice on career development, design principles, testing, debugging, automation, and team dynamics, helping programmers produce reliable, maintainable, and user-centric software.",
    isLoanedBook: true,
    pdfUrl: "/pdf/pragmatic-programmer.pdf",
  },
  {
    id: 3,
    title: "Refactoring",
    author: "Martin Fowler",
    genre: "Software Design",
    rating: 4.7,
    total_copies: 8,
    available_copies: 5,
    description:
      "Improving the design of existing code. The definitive guide to restructuring code safely.",
    color: "#1e3a8a",
    cover: "/images/covers/refactoring.svg",
    video: "/Create_a_highly_realistic_cine (1).mp4",
    summary:
      "Refactoring by Martin Fowler is the seminal work on restructuring existing code to improve its design and readability without changing its external behavior. It details step-by-step refactoring patterns, smells in code, and robust techniques to make legacy systems easy to maintain.",
    isLoanedBook: false,
    pdfUrl: "/sample.pdf",
  },
  {
    id: 4,
    title: "Design Patterns",
    author: "Erich Gamma et al. (GoF)",
    genre: "Software Architecture",
    rating: 4.8,
    total_copies: 10,
    available_copies: 6,
    description:
      "Elements of Reusable Object-Oriented Software. The classic blueprint guide to software design patterns.",
    color: "#064e3b",
    cover: "/images/covers/design-patterns.svg",
    video: "/Create_a_highly_realistic_cine (1).mp4",
    summary:
      "Design Patterns is the legendary 'Gang of Four' book that introduced patterns into object-oriented software engineering. It catalogs 23 classic design patterns categorized into Creational, Structural, and Behavioral patterns, providing reusable solutions to recurring design problems.",
    isLoanedBook: false,
    pdfUrl: "/sample.pdf",
  },
  {
    id: 5,
    title: "Domain-Driven Design",
    author: "Eric Evans",
    genre: "Software Architecture",
    rating: 4.7,
    total_copies: 6,
    available_copies: 2,
    description:
      "Tackling complexity in the heart of software. Align coding architecture directly with the business domain.",
    color: "#451a03",
    cover: "/images/covers/ddd.svg",
    video: "/Create_a_highly_realistic_cine (1).mp4",
    summary:
      "Domain-Driven Design (DDD) by Eric Evans establishes a framework for modeling complex software systems. It shows how strategic concepts like Bounded Contexts and Ubiquitous Language, alongside tactical patterns like Entities, Aggregates, and Repositories, connect software logic directly to core business rules.",
    isLoanedBook: false,
    pdfUrl: "/sample.pdf",
  },
  {
    id: 6,
    title: "You Don't Know JS Yet",
    author: "Kyle Simpson",
    genre: "JavaScript Programming",
    rating: 4.6,
    total_copies: 14,
    available_copies: 11,
    description:
      "Get started with the deep core mechanics of JavaScript. Master scopes, closures, and types.",
    color: "#854d0e",
    cover: "/images/covers/ydkjs.svg",
    video: "/Create_a_highly_realistic_cine (1).mp4",
    summary:
      "You Don't Know JS Yet is an essential series focused on exploring the core mechanics of the JavaScript language. By shedding light on closures, scoping, prototypes, and asynchronous patterns, it guides JS developers from visual shortcuts to complete runtime mastery.",
    isLoanedBook: false,
    pdfUrl: "/sample.pdf",
  },
  {
    id: 7,
    title: "SICP",
    author: "Harold Abelson & Gerald Sussman",
    genre: "Computer Science",
    rating: 4.9,
    total_copies: 5,
    available_copies: 0,
    description:
      "Structure and Interpretation of Computer Programs. The legendary wizard book introducing computer science principles.",
    color: "#3b0764",
    cover: "/images/covers/sicp.svg",
    video: "/Create_a_highly_realistic_cine (1).mp4",
    summary:
      "Structure and Interpretation of Computer Programs (SICP) is a legendary MIT computer science textbook. It uses Lisp/Scheme to teach recursion, functional programming, metalinguistic abstraction, and interpreter design, shaping the foundational skills of generations of computer scientists.",
    isLoanedBook: false,
    pdfUrl: "/sample.pdf",
  },
  {
    id: 8,
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    genre: "Distributed Systems",
    rating: 4.9,
    total_copies: 15,
    available_copies: 12,
    description:
      "The big ideas behind reliable, scalable, and maintainable systems for data processing and storage.",
    color: "#0f2d4a",
    cover: "/images/covers/designing-data.png",
    video: "/Create_a_highly_realistic_cine (1).mp4",
    summary:
      "Designing Data-Intensive Applications is a comprehensive guide to the principles and technologies underlying modern data systems. Martin Kleppmann helps readers navigate the diverse landscape of databases, queues, replication, partitioning, and consistency models, enabling developers to build reliable, scalable, and maintainable applications.",
    isLoanedBook: false,
    pdfUrl: "/pdf/ddia.pdf",
  },
];
