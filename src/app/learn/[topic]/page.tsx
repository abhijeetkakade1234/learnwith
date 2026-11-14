import Lesson from "@/components/Lesson";
import TicketDrop from "@/components/TicketDrop";
import Link from "next/link";
import type { Metadata } from "next";

export function generateStaticParams() { return [{ topic: "system-design" }, { topic: "avalanche" }]; }

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const name = topic === "avalanche" ? "Avalanche Blockchain" : "System Design";
  return { title: `${name} Interactive Lesson`, description: topic === "avalanche" ? "Follow an Avalanche transaction through an interactive early lesson." : "Save a ticket website, learn system design by trying fixes, and practise an interview answer.", alternates: { canonical: `/learn/${topic}/` } };
}

export default async function Page({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  if (topic === "avalanche") return <Lesson topic="avalanche" />;
  return <main className="lab-page"><header className="lab-nav"><Link href="/" className="lab-logo">← LEARNWITH<span> / </span>ABHIJEET</Link><span>LESSON 01 / SYSTEM DESIGN</span></header><section className="lab-lesson-intro"><p>INTERACTIVE LESSON · ABOUT 4 MINUTES</p><h1>Save the ticket site.</h1><span>You run a ticket website. 50,000 fans are about to arrive. Try a fix, see what happens, then practise explaining your design.</span></section><section className="lab-experiment" aria-label="Interactive ticket drop lesson"><TicketDrop /></section></main>;
}
