"use client";

import Link from "next/link";
import { useState } from "react";
import SpellbookScene from "./SpellbookScene";

const lessons = {
  "system-design": {
    title: "How does a request reach you?",
    intro: "Tap each part to trace a request through a simple web system.",
    parts: [
      ["Your device", "The browser asks for a page or data over the network."],
      ["Server", "The server receives the request, runs the application logic, and decides what to return."],
      ["Database", "The app reads or saves persistent information here when needed."],
    ],
    question: "Which part stores information between requests?",
    answers: ["Your device", "Server", "Database"],
    correct: 2,
  },
  avalanche: {
    title: "What does a validator do?",
    intro: "Tap each part to follow a transaction through a blockchain network.",
    parts: [
      ["Your wallet", "Your wallet signs a transaction so the network can check it came from you."],
      ["Network", "The signed transaction is shared with validators."],
      ["Validator", "Validators check transactions and participate in agreement on their order."],
    ],
    question: "Who checks transactions on the network?",
    answers: ["Wallet", "Website", "Validator"],
    correct: 2,
  },
} as const;

export default function Lesson({ topic }: { topic: keyof typeof lessons }) {
  const lesson = lessons[topic];
  const [part, setPart] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const total = lesson.parts.length;
  const [name, detail] = lesson.parts[part];
  const correct = answer === lesson.correct;
  return <main className="lesson-page">
    <nav className="lesson-nav" aria-label="Lesson">
      <Link href="/"><span aria-hidden="true">←</span> The notebook</Link>
      <span className="lesson-brand">Learn With <em>Abhijeet</em></span>
    </nav>
    <article className="lesson-guide">
      <section className="lesson-visual" aria-label="Interactive 3D diagram">
        <SpellbookScene topic={topic === "avalanche" ? "avalanche" : "system"} onSelect={setPart} variant="lesson" />
        <div className="lesson-plate" aria-hidden="true"><span>Plate {part + 1} of {total}</span><strong>{name}</strong></div>
        <p className="lesson-hint">Tap the floating objects to explore each step</p>
      </section>
      <section className="lesson-copy">
        <header className="lesson-header">
          <p className="lesson-kicker">{topic === "avalanche" ? "Avalanche blockchain" : "System design"}</p>
          <h1>{lesson.title}</h1>
          <p className="lesson-intro">{lesson.intro}</p>
        </header>
        <ol className="lesson-steps" aria-label="Steps">
          {lesson.parts.map(([stepName], index) => <li key={stepName}>
            <button type="button" className={part === index ? "active" : ""} aria-pressed={part === index} onClick={() => setPart(index)}>
              <span className="lesson-step-number" aria-hidden="true">{index + 1}</span><span>{stepName}</span>
            </button>
          </li>)}
        </ol>
        <div className="lesson-explain" aria-live="polite">
          <p className="lesson-eyebrow">Step {part + 1} of {total}</p>
          <h2 key={name}>{name}</h2>
          <p key={detail}>{detail}</p>
          <div className="lesson-pager">
            <button type="button" onClick={() => setPart(part - 1)} disabled={part === 0}><span aria-hidden="true">←</span> Previous</button>
            <button type="button" onClick={() => setPart(part + 1)} disabled={part === total - 1}>Next <span aria-hidden="true">→</span></button>
          </div>
        </div>
        <div className="lesson-quiz">
          <p className="lesson-eyebrow">Check your understanding</p>
          <h2>{lesson.question}</h2>
          <div>{lesson.answers.map((option, index) => <button type="button" key={option} onClick={() => setAnswer(index)} aria-pressed={answer === index} data-result={answer === index ? (correct ? "correct" : "wrong") : undefined}>{option}</button>)}</div>
          {answer !== null && <p role="status" data-result={correct ? "correct" : "wrong"}>{correct ? "Correct. You got it!" : "Try again. Follow the steps above."}</p>}
        </div>
      </section>
    </article>
  </main>;
}
