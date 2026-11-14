import AvalancheLab from "@/components/AvalancheLab";
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
  if (topic === "avalanche") return <main className="system-page"><header className="system-nav"><Link href="/">← LEARNWITH / ABHIJEET</Link><span>LESSON 02 / AVALANCHE</span></header><AvalancheLab /></main>;
  return <main className="system-page"><header className="system-nav"><Link href="/">← LEARNWITH / ABHIJEET</Link><span>LESSON 01 / SYSTEM DESIGN</span></header><TicketDrop /></main>;
}
