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
  return <main className="lesson-page">
    <nav className="lesson-nav"><Link href="/">← The notebook</Link><span>Learn With Abhijeet</span></nav>
    <div className="lesson-grid">
      <section className="lesson-copy"><p className="lesson-kicker">{topic === "avalanche" ? "Avalanche blockchain" : "System design"}</p><h1>{lesson.title}</h1><p>{lesson.intro}</p>
        <div className="lesson-steps">{lesson.parts.map(([name], index) => <button key={name} className={part === index ? "active" : ""} onClick={() => setPart(index)}>{index + 1}. {name}</button>)}</div>
        <div className="lesson-explain"><h2>{lesson.parts[part][0]}</h2><p>{lesson.parts[part][1]}</p></div>
        <div className="lesson-quiz"><h2>{lesson.question}</h2><div>{lesson.answers.map((name, index) => <button key={name} onClick={() => setAnswer(index)} aria-pressed={answer === index}>{name}</button>)}</div>{answer !== null && <p role="status">{answer === lesson.correct ? "Correct. You got it!" : "Try again. Follow the steps above."}</p>}</div>
      </section>
      <section className="lesson-visual"><SpellbookScene topic={topic === "avalanche" ? "avalanche" : "system"} onSelect={setPart} /><p>Tap the floating objects to explore each step</p></section>
    </div>
  </main>;
}
