export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What does HTML stand for?",
    options: [
      "HyperText Markup Language",
      "High-Level Textual Markup Language",
      "Hyperlinks and Text Markup Language",
      "Home Tool Markup Language",
    ],
    correctAnswer: "HyperText Markup Language",
    explanation:
      "HTML is the standard markup language for documents designed to be displayed in a web browser.",
  },
  {
    id: 2,
    question: "Which CSS property is used to change the background color of an element?",
    options: ["color", "bgcolor", "background-color", "background"],
    correctAnswer: "background-color",
    explanation:
      "The `background-color` property sets the background color of an element. The `background` property is a shorthand for several background properties.",
  },
  {
    id: 3,
    question: 'What is the correct syntax for referring to an external script called "app.js"?',
    options: [
      '<script src="app.js">',
      '<script href="app.js">',
      '<script name="app.js">',
      '<script link="app.js">',
    ],
    correctAnswer: '<script src="app.js">',
    explanation:
      "The `src` attribute in a `<script>` tag specifies the URL of an external script file.",
  },
  {
    id: 4,
    question: "Which company developed JavaScript?",
    options: ["Microsoft", "Sun Microsystems", "Netscape", "Google"],
    correctAnswer: "Netscape",
    explanation:
      "JavaScript was created by Brendan Eich in 1995 while he was an engineer at Netscape Communications.",
  },
  {
    id: 5,
    question: "In React, what is used to pass data to a component from outside?",
    options: ["state", "props", "arguments", "data"],
    correctAnswer: "props",
    explanation:
      "'Props' (short for properties) are read-only and are used to pass data from a parent component to a child component.",
  },
];
