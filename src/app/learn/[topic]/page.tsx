import Lesson from "@/components/Lesson";
import type { Metadata } from "next";

export function generateStaticParams() { return [{ topic: "system-design" }, { topic: "avalanche" }]; }

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const name = topic === "avalanche" ? "Avalanche Blockchain" : "System Design";
  return { title: `${name} Interactive Lesson`, description: `Explore ${name.toLowerCase()} through an interactive 3D notebook and a quick challenge.`, alternates: { canonical: `/learn/${topic}/` } };
}

export default async function Page({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  return <Lesson topic={topic === "avalanche" ? "avalanche" : "system-design"} />;
}
