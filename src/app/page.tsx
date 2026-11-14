import Link from "next/link";

export default function Home() {
  return <main className="front">
    <header className="front-nav"><Link href="/" className="front-brand">LEARNWITH<span> / </span>ABHIJEET</Link><span>INTERACTIVE TECH LESSONS</span><span className="front-free">NO ACCOUNT NEEDED</span></header>
    <section className="front-stage" aria-labelledby="front-title"><div className="front-copy"><p className="front-eyebrow"><span /> LEARN BY DOING</p><h1 id="front-title">See what<br />breaks.<br /><em>Make it work.</em></h1><p>Complex tech gets easier when you can change it. Run a system, watch the consequences, and practise explaining your decisions in an interview.</p><Link className="front-cta" href="/learn/system-design">START WITH SYSTEM DESIGN <span aria-hidden="true">↗</span></Link></div>
      <div className="front-preview" aria-label="Preview of the ticket site system"><div className="front-preview-head"><span>LIVE SCENARIO / 01</span><span><i /> SYSTEM UNDER LOAD</span></div><div className="front-preview-title"><span>THE TICKET DROP</span><strong>50,000 fans.<br />One small server.</strong></div><div className="front-preview-flow" aria-hidden="true"><div><span>◌</span><small>FANS</small><strong>2,000/s</strong></div><b>····→</b><div className="front-preview-fail"><span>▣</span><small>SERVER</small><strong>1,200/s</strong></div><b>····→</b><div><span>▥</span><small>SEATS</small><strong>500</strong></div></div><div className="front-preview-footer"><span>ONLY 60% GET THROUGH</span><span>WHAT WOULD YOU CHANGE? ↗</span></div></div>
    </section>
    <nav className="front-topics" aria-label="Choose a lesson"><Link href="/learn/system-design"><span>01</span><strong>System design</strong><small>SAVE THE TICKET SITE</small><b aria-hidden="true">↗</b></Link><Link href="/learn/avalanche"><span>02</span><strong>Avalanche blockchain</strong><small>EARLY LESSON · FOLLOW A TRANSACTION</small><b aria-hidden="true">↗</b></Link></nav>
  </main>;
}
