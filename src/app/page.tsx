import Link from "next/link";
import TicketDrop from "@/components/TicketDrop";

export default function Home() {
  return <main className="lab-page">
    <header className="lab-nav"><Link href="/" className="lab-logo">LEARNWITH<span> / </span>ABHIJEET</Link><span>INTERACTIVE FIELD NOTES <b>001</b></span></header>
    <section className="lab-intro" aria-labelledby="lab-title">
      <div><p className="lab-eyebrow"><span className="lab-live" /> YOU ARE IN CONTROL</p><h1 id="lab-title">Break it.<br /><em>Fix it.</em><br />Explain it.</h1></div>
      <div className="lab-intro-side"><p>Can you keep a ticket site alive when everyone arrives at once?</p><p>Make a change. See what breaks. Leave ready to explain <strong>why</strong> your design works.</p><a href="#experiment" className="lab-jump">RUN THE EXPERIMENT <span aria-hidden="true">↘</span></a></div>
    </section>
    <div className="lab-ticker" aria-hidden="true"><span>50,000 FANS</span><span>500 SEATS</span><span>ONE SYSTEM TO SAVE</span></div>
    <section id="experiment" className="lab-experiment" aria-label="Interactive ticket drop lesson"><div className="lab-experiment-head"><span>EXPERIMENT 01 / SYSTEM DESIGN</span><span>~ 4 MINUTES · NO ACCOUNT</span></div><TicketDrop /></section>
    <section className="lab-next"><span>UP NEXT / AVALANCHE</span><h2>What if nobody owns the system?</h2><p>Send a transaction. Watch validators decide what is real.</p><span className="lab-soon">NEXT EXPERIMENT IN DEVELOPMENT <span aria-hidden="true">↗</span></span></section>
    <footer className="lab-footer"><span>LEARNWITH / ABHIJEET</span><span>BUILT TO MAKE COMPLEX THINGS CLICK.</span></footer>
  </main>;
}
