import Link from "next/link";
import TicketDrop from "@/components/TicketDrop";

export default function Home() {
  return <main className="lab-page">
    <header className="lab-nav"><Link href="/" className="lab-logo">LEARNWITH<span> / </span>ABHIJEET</Link><span>LEARN BY DOING <b>001</b></span></header>
    <section className="lab-intro" aria-labelledby="lab-title">
      <div><p className="lab-eyebrow"><span className="lab-live" /> A PLAYABLE SYSTEM DESIGN LESSON</p><h1 id="lab-title">Save the<br /><em>ticket site.</em></h1></div>
      <div className="lab-intro-side"><p>50,000 fans arrive at once. Your job is to keep the ticket website working.</p><p>Try a fix, watch what happens, and learn <strong>why</strong> it works. At the end, practise explaining your choices like you would in an interview.</p><a href="#experiment" className="lab-jump">START THE 4-MINUTE LESSON <span aria-hidden="true">↘</span></a></div>
    </section>
    <div className="lab-ticker" aria-label="Lesson flow"><span>01 / SEE IT BREAK</span><span>02 / TRY A FIX</span><span>03 / EXPLAIN IT</span></div>
    <section id="experiment" className="lab-experiment" aria-label="Interactive ticket drop lesson"><div className="lab-experiment-head"><span>EXPERIMENT 01 / SYSTEM DESIGN</span><span>~ 4 MINUTES · NO ACCOUNT</span></div><TicketDrop /></section>
    <section className="lab-next"><span>UP NEXT / AVALANCHE</span><h2>What if nobody owns the system?</h2><p>Send a transaction. Watch validators decide what is real.</p><span className="lab-soon">NEXT EXPERIMENT IN DEVELOPMENT <span aria-hidden="true">↗</span></span></section>
    <footer className="lab-footer"><span>LEARNWITH / ABHIJEET</span><span>BUILT TO MAKE COMPLEX THINGS CLICK.</span></footer>
  </main>;
}
