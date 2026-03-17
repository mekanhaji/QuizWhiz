# **App Name**: QuizWhiz

## Core Features:

- Load Questions: Dynamically import quiz questions and answers from a JSON file.
- Display Question: Display one question at a time with multiple-choice options.
- Answer Submission: Allow users to select an option and submit their answer for evaluation.
- Immediate Feedback: Show immediate feedback after answer submission. Highlight correct answer in green and incorrect answer in red; reveal the correct answer if the submission was incorrect.
- Explanation Display: Display an explanation after answering to educate the user.
- Quiz Navigation: Enable navigation to the next question; disable next button after answering until the next question is rendered.
- Score Tracking: Show the total score and percentage at the end of the quiz.
- Dynamic Prompt Builder: Provide configurable AI prompt parameters for MCQ JSON generation with runtime overrides.

## Prompt Builder Requirements:

- Prompt must support dynamic fields for:
  - `numQuestions`
  - `difficulty`
  - `topics`
- Prompt defaults must exist and be centrally managed.
- Prompt should remain easy to extend with:
  - `language`
  - `includeExplanations`
  - `randomizeOptions`
  - `optionsPerQuestion`
  - `willAttachNotes`
- Prompt output must always instruct the model to produce:
  - `[{ question: string, option: string[], answer: string, explanation: string }]`

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) for a calm, focused learning environment.
- Background color: Very light Indigo (#E8EAF6), almost white, to maintain focus and readability.
- Accent color: Amber (#FFC107) to highlight key elements and provide clear visual cues.
- Body and headline font: 'PT Sans', a humanist sans-serif.
- Use clear and concise icons for navigation (e.g., next, previous, submit).
- Design a clean, responsive layout with a progress bar to track quiz completion.
- Subtle animations for transitions between questions and displaying feedback.
