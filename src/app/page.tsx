"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useState } from "react";

const SpellbookScene = dynamic(() => import("@/components/SpellbookScene"), { ssr: false, loading: () => <div className="scene-loading" aria-hidden="true">✦</div> });
type Topic = "system" | "avalanche";
const chapters = {
  system: { number: "I", title: "System Design", description: "Follow a web request from your browser to a server and database.", href: "/learn/system-design", ideas: ["Your device sends a request", "The server handles it", "The database stores data"] },
  avalanche: { number: "II", title: "Avalanche Blockchain", description: "Follow a signed transaction from your wallet through the network.", href: "/learn/avalanche", ideas: ["Your wallet signs", "The network shares it", "Validators check it"] },
} as const;

export default function Home() {
  const [topic, setTopic] = useState<Topic>("system");
  const [idea, setIdea] = useState<number | null>(null);
  const chapter = chapters[topic];
  const choose = (value: string) => { if (value) { setTopic(value as Topic); setIdea(null); } };
  return <main className="landing">
    <header className="landing-head">
      <p className="landing-brand"><span aria-hidden="true">✦</span> Learnwith</p>
      <p className="landing-note">Interactive lessons · no account needed</p>
    </header>
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="landing-copy">
        <p className="landing-kicker"><span aria-hidden="true">— </span>The Learning Atlas</p>
        <h1 id="landing-title">Open the book. <em>Watch ideas rise.</em></h1>
        <p className="dock-description" key={topic}>{chapter.description}</p>
        <Link className="enter-cta" href={chapter.href}>Begin Chapter {chapter.number}: {chapter.title} <span aria-hidden="true">→</span></Link>
      </div>
      <div className="landing-stage">
        <SpellbookScene topic={topic} active={idea ?? 0} onSelect={setIdea} />
      </div>
      <div className="landing-dock">
        <p className="dock-label">Choose a chapter</p>
        <ToggleGroup.Root className="chapter-picker" type="single" value={topic} onValueChange={choose} aria-label="Choose a chapter">
          {(Object.keys(chapters) as Topic[]).map(key => <ToggleGroup.Item key={key} value={key} className="chapter-pill">
            <span className="pill-number" aria-hidden="true">{chapters[key].number}</span>
            <span className="pill-title">{chapters[key].title}</span>
          </ToggleGroup.Item>)}
        </ToggleGroup.Root>
        <p className="dock-label">Explore the three ideas</p>
        <div className="idea-steps" aria-label="Explore the three ideas">{chapter.ideas.map((name, index) => <button key={name} type="button" aria-pressed={idea === index} onClick={() => setIdea(index)}><span>0{index + 1}</span>{name}</button>)}</div>
        <p className="stage-caption" aria-live="polite">{idea === null ? "Tap an object to explore" : `${idea + 1} · ${chapter.ideas[idea] ?? ""}`}</p>
      </div>
    </section>
    <footer className="landing-foot"><span aria-hidden="true">✦ · ✦</span> Made for curious minds <span aria-hidden="true">✦ · ✦</span></footer>
  </main>;
}
