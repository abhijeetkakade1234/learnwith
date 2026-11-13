"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useState } from "react";

const SpellbookScene = dynamic(() => import("@/components/SpellbookScene"), { ssr: false });
type Topic = "system" | "avalanche";
const chapters = {
  system: { number: "I", title: "System Design", description: "Explore how servers, caches, and databases work together to make reliable apps.", href: "/learn/system-design", sigil: "◇ ─ ◇ ─ ◇" },
  avalanche: { number: "II", title: "Avalanche Blockchain", description: "Follow a transaction through Avalanche and see the network come alive.", href: "/learn/avalanche", sigil: "△ · △ · △" },
} as const;

export default function Home() {
  const [topic, setTopic] = useState<Topic>("system");
  const chapter = chapters[topic];
  return <main className="site-shell">
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Learnwith home"><span aria-hidden="true">✦ </span>Learnwith<span className="brand-period">.</span></Link>
      <span className="header-note">An atlas of things worth understanding</span>
      <a className="header-link" href="#chapters">Explore chapters ↗</a>
    </header>
    <section className="book" aria-labelledby="book-title">
      <div className="book-spine" aria-hidden="true" />
      <div className="book-page left-page" id="chapters"><div className="page-inner">
        <div className="page-topline"><span>THE LEARNING ATLAS</span><span>VOL. I · 2026</span></div>
        <div className="flourish" aria-hidden="true">✦ &nbsp; · &nbsp; ✦</div>
        <h1 id="book-title">Choose a world<br /><em>to explore.</em></h1>
        <p className="intro">Open the book. Watch ideas rise from its pages, then move them yourself to see how they work.</p>
        <ToggleGroup.Root className="chapter-list" type="single" value={topic} onValueChange={value => { if (value) setTopic(value as Topic); }} aria-label="Choose a learning chapter">
          {(Object.keys(chapters) as Topic[]).map(key => <ToggleGroup.Item key={key} value={key} className={`chapter-choice ${topic === key ? "selected" : ""}`}>
            <span className="chapter-number">CHAPTER {chapters[key].number}</span>
            <span className="choice-main"><strong>{chapters[key].title}</strong><span aria-hidden="true">↗</span></span>
            <span className="choice-description">{chapters[key].description}</span>
            <span className="choice-sigil" aria-hidden="true">{chapters[key].sigil}</span>
          </ToggleGroup.Item>)}
        </ToggleGroup.Root>
        <div className="page-foot"><span>NO ACCOUNT NEEDED</span><span>01 / 02</span></div>
      </div></div>
      <div className="book-page right-page"><div className="page-inner right-inner">
        <div className="page-topline"><span>FIELD NOTES</span><span>✧ &nbsp; EXPLORE FREELY</span></div>
        <div className="scene-frame"><SpellbookScene topic={topic} /></div>
        <div className="scene-caption">✦ &nbsp; TAP THE BOOK TO REVEAL ITS IDEAS &nbsp; ✦</div>
        <div className="selected-detail" key={topic}>
          <span className="chapter-number">CHAPTER {chapter.number}</span>
          <h2>{chapter.title}</h2><p>{chapter.description}</p>
          <Link className="open-button" href={chapter.href}>Open chapter <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="page-foot"><span>LEARN BY DOING</span><span>✦</span></div>
      </div></div>
    </section>
    <footer className="site-footer"><span>Made for curious minds.</span><span>Pick a chapter. Turn the page.</span></footer>
  </main>;
}
