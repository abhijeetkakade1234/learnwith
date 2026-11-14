import Link from "next/link";

export default function Home() {
  return <main className="hub">
    <header className="hub-nav"><Link href="/" className="hub-brand">LEARNWITH<span> / </span>ABHIJEET</Link><span>LEARN BY DOING</span></header>
    <section className="hub-main" aria-labelledby="hub-title">
      <div className="hub-intro"><p className="hub-eyebrow"><span /> CURIOUS MINDS START HERE</p><h1 id="hub-title">Learn it.<br /><em>Explain it.</em></h1><p>Short, interactive lessons that turn difficult tech ideas into something you can see, try, and talk about in an interview.</p></div>
      <div className="hub-topics" aria-label="Choose a topic">
        <Link className="hub-topic hub-topic-live" href="/learn/system-design"><span className="hub-topic-top"><span>01 / SYSTEM DESIGN</span><span>START HERE ↗</span></span><span className="hub-topic-name">Save the<br />ticket site.</span><span className="hub-topic-bottom"><span>Traffic surges. Servers fail. Your decisions change what happens.</span><span>PLAY THE LESSON <b aria-hidden="true">↗</b></span></span></Link>
        <Link className="hub-topic hub-topic-alt" href="/learn/avalanche"><span className="hub-topic-top"><span>02 / AVALANCHE BLOCKCHAIN</span><span>EARLY LESSON ↗</span></span><span className="hub-topic-name">Follow a<br />transaction.</span><span className="hub-topic-bottom"><span>See how a wallet, network, and validators work together.</span><span>EXPLORE THE LESSON <b aria-hidden="true">↗</b></span></span></Link>
      </div>
    </section>
    <footer className="hub-footer"><span>NO ACCOUNT NEEDED</span><span>FROM A REEL TO A REAL UNDERSTANDING.</span></footer>
  </main>;
}
