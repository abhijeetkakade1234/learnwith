"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

/* Declared capacities — every number on screen derives from these. */
const DEMAND = 2000; // fan requests/second when the sale opens
const SERVER_CAP = 1200; // requests/second one app server can handle
const DB_CAP = 800; // queries/second the database can handle
const CHECKOUT_SHARE = 0.1; // share of requests that are checkouts (1 DB write each)
const CACHE_HIT = 0.9; // share of seat-map reads answered by the cache
const CACHE_TTL = 2; // seconds a cached seat map can be stale
const SEATS = 500; // seats for sale
const ADMIT = 100; // checkouts/second the waiting room lets through

type Fix = "none" | "lock" | "queue";
type Config = { servers: number; lb: boolean; cache: boolean; fix: Fix; showDb: boolean; checkout: boolean };

function compute(c: Config) {
  const webCap = c.lb ? c.servers * SERVER_CAP : SERVER_CAP; // no router: everyone hits server 1
  const served = Math.min(DEMAND, webCap);
  const perServer = c.lb ? served / c.servers : served;
  const checkouts = served * CHECKOUT_SHARE;
  const writes = c.fix === "queue" ? Math.min(checkouts, ADMIT) : checkouts;
  const reads = (served - checkouts) * (c.cache ? 1 - CACHE_HIT : 1);
  const dbLoad = reads + writes;
  const dbOk = Math.min(1, DB_CAP / dbLoad);
  const success = c.showDb ? (served / DEMAND) * dbOk : served / DEMAND;
  const staleDecisions = c.cache && c.fix === "none" ? writes * CACHE_TTL : 0;
  const sellOut = SEATS / (writes * (c.showDb ? dbOk : 1));
  const queueGrowth = c.fix === "queue" ? checkouts - writes : 0;
  return { webCap, served, perServer, checkouts, writes, reads, dbLoad, success, staleDecisions, sellOut, queueGrowth };
}

type Step = { title: string; story: string; config: Config; next?: string };

const base: Config = { servers: 1, lb: false, cache: false, fix: "none", showDb: false, checkout: false };
const STEPS: Step[] = [
  { title: "Ticket drop at 10:00", story: `${SEATS} seats. Fans will send ${DEMAND} requests/second the moment the sale opens.`, config: base, next: "Start the sale" },
  { title: "One server melts", story: `Think of a server as a cashier. This one can handle ${SERVER_CAP} requests each second, but ${DEMAND} arrive. The rest get errors.`, config: base, next: "Add a second server" },
  { title: "Two servers, still failing", story: "A second cashier is open, but everyone still joins line one. Nothing sends fans to the new server, so it sits idle.", config: { ...base, servers: 2 }, next: "Add a load balancer" },
  { title: "Load balancer spreads traffic", story: "A load balancer acts as a traffic director. It splits fans between the two servers, so neither is overwhelmed. Follow the requests downstream…", config: { ...base, servers: 2, lb: true }, next: "Check the database" },
  { title: "Database bottleneck", story: `The database is the seat ledger. Every page view asks it for the latest seat map, but it can answer only ${DB_CAP} questions each second.`, config: { ...base, servers: 2, lb: true, showDb: true }, next: "Add a cache" },
  { title: "Cache absorbs reads", story: `A cache keeps a quick copy of the seat map. It answers ${CACHE_HIT * 100}% of reads, leaving fewer questions for the database.`, config: { ...base, servers: 2, lb: true, showDb: true, cache: true }, next: "Open checkout" },
  { title: "Oversell risk", story: `That quick copy can be ${CACHE_TTL} seconds old. Two buyers may both see the same free seat. If checkout doesn't check the real ledger, both could be sold it.`, config: { ...base, servers: 2, lb: true, showDb: true, cache: true, checkout: true } },
  { title: "Seat is safe", story: "", config: { ...base, servers: 2, lb: true, showDb: true, cache: true, checkout: true }, next: "Show interview answer" },
  { title: "Interview answer", story: "", config: { ...base, servers: 2, lb: true, showDb: true, cache: true, checkout: true } },
];

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const pct = (n: number) => `${Math.round(n * 100)}%`;
const tone = (load: number, cap: number) => (load > cap ? "td-bad" : load > cap * 0.8 ? "td-warn" : "td-ok");

export default function TicketDrop() {
  const [step, setStep] = useState(0);
  const [fix, setFix] = useState<Fix>("none");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const s = STEPS[step];
  const cfg: Config = { ...s.config, fix: step >= 7 ? fix : "none" };
  const m = compute(cfg);

  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  const go = (n: number) => setStep(Math.max(0, Math.min(STEPS.length - 1, n)));
  const restart = () => {
    setFix("none");
    go(0);
  };
  const choose = (f: Fix) => {
    setFix(f);
    go(7);
  };
  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft" && step > 0) {
      e.preventDefault();
      go(step - 1);
    } else if (e.key === "ArrowRight" && s.next) {
      e.preventDefault();
      go(step + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      restart();
    }
  };

  const fixStory =
    fix === "lock"
      ? "At checkout, the real seat ledger checks whether the seat is still free and holds it in one indivisible action. Engineers call this an atomic conditional write. Only one buyer wins; unpaid holds expire."
      : `A waiting room lets in ${ADMIT} buyers each second. Others wait instead of rushing checkout. The real seat ledger still gives each seat to only one buyer with a conditional write.`;

  return (
    <section className="td-root" aria-labelledby="td-title" onKeyDown={onKey}>
      <style>{css}</style>
      <p className="td-progress" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
        {STEPS.map((_, i) => (
          <span key={i} className={i <= step ? "td-dot td-dot-on" : "td-dot"} aria-hidden="true" />
        ))}
      </p>
      <h2 id="td-title" ref={headingRef} tabIndex={-1} className="td-title">
        {s.title}
      </h2>
      <p className="td-story" aria-live="polite">
        {step === 7 ? fixStory : s.story}
      </p>

      {step > 0 && step < 8 && <Diagram cfg={cfg} m={m} />}

      {step > 0 && step < 8 && (
        <dl className="td-metrics" aria-label="Live metrics">
          <Metric label="Demand" value={`${fmt(DEMAND)} req/s`} />
          <Metric label="Web capacity usable" value={`${fmt(m.webCap)} req/s`} cls={tone(DEMAND, m.webCap)} />
          <Metric label={cfg.lb ? "Load per server" : "Load on server 1"} value={`${fmt(cfg.lb ? DEMAND / cfg.servers : DEMAND)} / ${fmt(SERVER_CAP)}`} cls={tone(cfg.lb ? DEMAND / cfg.servers : DEMAND, SERVER_CAP)} />
          {cfg.showDb && <Metric label="DB load" value={`${fmt(m.dbLoad)} / ${fmt(DB_CAP)} q/s`} cls={tone(m.dbLoad, DB_CAP)} />}
          <Metric label="Requests succeeding" value={pct(m.success)} cls={m.success < 1 ? "td-bad" : "td-ok"} />
          {cfg.checkout && <Metric label="Checkouts on stale data" value={m.staleDecisions ? `up to ${fmt(m.staleDecisions)} per ${CACHE_TTL}s` : "0 — writes are conditional"} cls={m.staleDecisions ? "td-bad" : "td-ok"} />}
          {cfg.checkout && cfg.fix !== "none" && <Metric label="Sells out in" value={`${m.sellOut.toFixed(1)} s`} />}
          {cfg.fix === "queue" && <Metric label="Queue grows by" value={`${fmt(m.queueGrowth)} buyers/s`} cls="td-warn" />}
        </dl>
      )}

      {step === 8 && <Summary fix={fix} />}

      <div className="td-actions">
        {step > 0 && (
          <button type="button" className="td-btn td-ghost" onClick={() => go(step - 1)}>
            Back
          </button>
        )}
        {s.next && (
          <button type="button" className="td-btn" onClick={() => go(step + 1)}>
            {s.next}
          </button>
        )}
        {step === 6 && (
          <fieldset className="td-choice">
            <legend>Choose a fix for overselling</legend>
            <button type="button" className="td-btn" onClick={() => choose("lock")}>
              Seat lock (conditional write)
            </button>
            <button type="button" className="td-btn" onClick={() => choose("queue")}>
              Waiting room (admission queue)
            </button>
          </fieldset>
        )}
        {step === 8 && (
          <button type="button" className="td-btn" onClick={restart}>
            Restart lesson
          </button>
        )}
      </div>
      <p className="td-hint">Keyboard: Tab to buttons, Enter to press · ← back · → next · Home restart</p>
    </section>
  );
}

function Metric({ label, value, cls = "" }: { label: string; value: string; cls?: string }) {
  return (
    <div className={`td-metric ${cls}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Node({ x, y, label, sub, cls }: { x: number; y: number; label: string; sub: string; cls: string }) {
  return (
    <g className={`td-node ${cls}`}>
      <rect x={x} y={y} width={110} height={48} rx={8} />
      <text x={x + 55} y={y + 21} textAnchor="middle">{label}</text>
      <text x={x + 55} y={y + 38} textAnchor="middle" className="td-sub">{sub}</text>
    </g>
  );
}

function Diagram({ cfg, m }: { cfg: Config; m: ReturnType<typeof compute> }) {
  const servers = Array.from({ length: cfg.servers }, (_, i) => i);
  const sy = (i: number) => (cfg.servers === 1 ? 86 : 40 + i * 92);
  const webX = cfg.lb ? 280 : 160;
  const loadOf = (i: number) => (cfg.lb ? DEMAND / cfg.servers : i === 0 ? DEMAND : 0);
  const desc = `Fans send ${fmt(DEMAND)} req/s${cfg.lb ? " through a load balancer" : ""} to ${cfg.servers} server(s)${cfg.cache ? ", then a cache" : ""}${cfg.showDb ? `, then a database at ${fmt(m.dbLoad)} of ${fmt(DB_CAP)} q/s` : ""}.`;
  return (
    <>
    <div className="td-mobile-flow" aria-label={desc}>
      <div><strong>Fans</strong><span>{fmt(DEMAND)} req/s</span></div>
      {cfg.lb && <div className="td-mobile-ok"><strong>Load balancer</strong><span>Splits traffic</span></div>}
      {servers.map(i => <div key={i} className={loadOf(i) ? tone(loadOf(i), SERVER_CAP) : "td-mobile-idle"}><strong>Server {i + 1}</strong><span>{fmt(loadOf(i))} / {fmt(SERVER_CAP)} req/s</span></div>)}
      {cfg.cache && <div className="td-mobile-ok"><strong>Cache</strong><span>{pct(CACHE_HIT)} of reads answered</span></div>}
      {cfg.showDb && <div className={tone(m.dbLoad, DB_CAP)}><strong>Database</strong><span>{fmt(m.dbLoad)} / {fmt(DB_CAP)} q/s</span></div>}
    </div>
    <svg className="td-diagram" viewBox="0 0 680 220" role="img" aria-label={desc}>
      <Node x={10} y={86} label="Fans" sub={`${fmt(DEMAND)} req/s`} cls="td-neutral" />
      {cfg.lb && <Node x={150} y={86} label="Load balancer" sub="round robin" cls="td-ok" />}
      {servers.map((i) => (
        <g key={i}>
          <line className={loadOf(i) ? "td-flow" : "td-idle"} x1={cfg.lb ? 260 : 120} y1={110} x2={webX} y2={sy(i) + 24} />
          <Node x={webX} y={sy(i)} label={`Server ${i + 1}`} sub={`${fmt(loadOf(i))} / ${fmt(SERVER_CAP)}`} cls={loadOf(i) ? tone(loadOf(i), SERVER_CAP) : "td-neutral"} />
        </g>
      ))}
      {cfg.cache && (
        <>
          <line className="td-flow" x1={webX + 110} y1={110} x2={420} y2={110} />
          <Node x={420} y={86} label="Cache" sub={`${pct(CACHE_HIT)} hits`} cls="td-ok" />
        </>
      )}
      {cfg.showDb && (
        <>
          <line className="td-flow" x1={cfg.cache ? 530 : webX + 110} y1={110} x2={560} y2={110} />
          <Node x={560} y={86} label="Database" sub={`${fmt(m.dbLoad)} / ${fmt(DB_CAP)} q/s`} cls={tone(m.dbLoad, DB_CAP)} />
        </>
      )}
    </svg>
    </>
  );
}

function Summary({ fix }: { fix: Fix }) {
  const [answer, setAnswer] = useState("");
  const one = compute({ ...base });
  const lbM = compute({ ...base, servers: 2, lb: true, showDb: true });
  const cached = compute({ ...base, servers: 2, lb: true, showDb: true, cache: true, checkout: true, fix });
  return (
    <div className="td-summary">
      <p>
        <strong>“How would you design a ticket drop?”</strong>
      </p>
      <ol>
        <li>Estimate: {fmt(DEMAND)} req/s peak against {fmt(SERVER_CAP)} req/s per server, so one server serves only {pct(one.success)}.</li>
        <li>Scale horizontally to 2 servers behind a load balancer: {fmt(lbM.perServer)} req/s each, under capacity. Extra servers without routing do nothing.</li>
        <li>The DB then sees {fmt(lbM.dbLoad)} q/s vs {fmt(DB_CAP)} capacity. A seat-map cache with {pct(CACHE_HIT)} hit rate cuts it to {fmt(cached.dbLoad)} q/s.</li>
        <li>Cached reads can be stale, so correctness lives in the DB: {fix === "lock" ? "a conditional write (seat lock with hold TTL) guarantees one winner per seat" : `a waiting room admits ${ADMIT} checkouts/s, and admitted buyers claim seats with a conditional write`}.</li>
        <li>Trade-off: {fix === "lock" ? `fastest sell-out (${cached.sellOut.toFixed(1)}s), but losers see “seat taken” errors.` : `fairer and gentler on the DB (${fmt(cached.dbLoad)} q/s), but buyers wait; the queue grows ${fmt(cached.queueGrowth)}/s and seats sell out in ${cached.sellOut.toFixed(1)}s.`}</li>
      </ol>
      <div className="td-practice">
        <label htmlFor="td-answer">Now explain it in your own words. How would you keep the ticket drop alive?</label>
        <textarea id="td-answer" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="I would first estimate peak traffic…" rows={5} />
        <p>Use these as a self-check, not a score:</p>
        <ul>
          <li>What breaks first, and why?</li><li>Why does the second server need a load balancer?</li><li>What does the cache help, and what can go wrong?</li><li>How does your {fix === "lock" ? "seat lock" : "waiting room"} protect a seat?</li>
        </ul>
      </div>
    </div>
  );
}

const css = `
.td-root{--ink:#0b0f10;--paper:#f2f0e9;--coral:#ff624d;--lime:#c8f85a;--rule:rgba(11,15,16,.14);--mute:#4a4f50;position:relative;width:100%;max-width:none;margin:0;padding:clamp(1.25rem,5vw,5rem) clamp(1rem,6vw,6rem);box-sizing:border-box;background-color:var(--paper);background-image:linear-gradient(var(--rule) 1px,transparent 1px),linear-gradient(90deg,var(--rule) 1px,transparent 1px),linear-gradient(rgba(11,15,16,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(11,15,16,.05) 1px,transparent 1px);background-size:96px 96px,96px 96px,24px 24px,24px 24px;background-position:-1px -1px;color:var(--ink);font-family:"Inter","Helvetica Neue",Helvetica,Arial,system-ui,sans-serif;font-feature-settings:"tnum" 1,"ss01" 1;-webkit-font-smoothing:antialiased;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink)}
.td-root *{box-sizing:border-box}
.td-progress{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:4px;margin:0 0 clamp(2rem,6vw,4.5rem);max-width:640px}
.td-dot{display:block;height:3px;background:var(--rule)}
.td-dot-on{background:var(--ink)}
.td-dot-on:last-of-type,.td-dot-on:has(+ .td-dot:not(.td-dot-on)){background:var(--coral)}
.td-title{font-size:clamp(2.6rem,9vw,7.5rem);line-height:.9;letter-spacing:-.055em;font-weight:700;margin:0 0 clamp(1rem,3vw,2rem);max-width:14ch;outline:none;text-wrap:balance}
.td-title:focus-visible{outline:3px solid var(--coral);outline-offset:8px}
.td-story{font-size:clamp(1.05rem,1.8vw,1.45rem);line-height:1.45;letter-spacing:-.01em;color:var(--ink);max-width:46ch;min-height:3em;margin:0 0 clamp(2rem,5vw,4rem);padding-left:1rem;border-left:3px solid var(--coral)}
.td-diagram{display:block;width:calc(100% + 2 * clamp(1rem,6vw,6rem));max-width:none;height:auto;margin:0 calc(-1 * clamp(1rem,6vw,6rem));padding:clamp(1rem,4vw,3.5rem) clamp(.5rem,5vw,5rem);background-color:var(--ink);background-image:linear-gradient(rgba(242,240,233,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(242,240,233,.07) 1px,transparent 1px);background-size:32px 32px;overflow:visible}
.td-node rect{fill:var(--ink);stroke:var(--paper);stroke-width:1.25;rx:0;ry:0}
.td-node text{fill:var(--paper);font-size:12.5px;font-weight:600;letter-spacing:-.01em}
.td-node .td-sub{font-size:10.5px;font-weight:400;fill:rgba(242,240,233,.78);font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace}
.td-node.td-ok rect{stroke:var(--lime);stroke-width:2}
.td-node.td-warn rect{stroke:var(--paper);stroke-width:2;stroke-dasharray:4 3}
.td-node.td-bad rect{fill:var(--coral);stroke:var(--coral);stroke-width:2}
.td-node.td-bad text,.td-node.td-bad .td-sub{fill:var(--ink)}
.td-node.td-neutral rect{stroke:rgba(242,240,233,.55)}
.td-flow{stroke:var(--lime);stroke-width:1.5;stroke-dasharray:2 6;stroke-linecap:round;animation:td-dash 1.2s linear infinite}
.td-idle{stroke:rgba(242,240,233,.3);stroke-width:1;stroke-dasharray:1 5}
@keyframes td-dash{to{stroke-dashoffset:-16}}
.td-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:0;margin:clamp(2rem,5vw,4rem) 0 0;border-top:1px solid var(--ink);border-left:1px solid var(--ink)}
.td-metric{position:relative;display:flex;flex-direction:column;justify-content:space-between;gap:1.75rem;min-height:clamp(9rem,16vw,12rem);padding:1.1rem 1.25rem 1.25rem;background:var(--paper);border-right:1px solid var(--ink);border-bottom:1px solid var(--ink)}
.td-metric::before{content:"";position:absolute;top:0;left:0;width:2.5rem;height:4px;background:var(--ink)}
.td-metric dt{font-size:.72rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
.td-metric dd{margin:0;font-size:clamp(2rem,4.2vw,3.6rem);line-height:.95;font-weight:700;letter-spacing:-.045em;color:var(--ink)}
.td-metric.td-ok::before{background:var(--lime);width:100%}
.td-metric.td-warn::before{width:100%;background:repeating-linear-gradient(90deg,var(--ink) 0 8px,transparent 8px 12px)}
.td-metric.td-bad{background:var(--coral)}
.td-metric.td-bad dt{color:var(--ink)}
.td-metric.td-bad::before{background:var(--ink);width:100%}
.td-actions{display:flex;flex-wrap:wrap;gap:.75rem;align-items:flex-end;margin-top:clamp(2.5rem,6vw,5rem);padding-top:1.5rem;border-top:1px solid var(--ink)}
.td-btn{appearance:none;display:inline-flex;align-items:center;gap:.9rem;min-height:3.25rem;padding:.9rem 1.5rem;background:var(--ink);color:var(--paper);border:1px solid var(--ink);border-radius:0;font:inherit;font-size:1rem;font-weight:600;letter-spacing:-.01em;cursor:pointer;transition:background-color .18s ease,color .18s ease}
.td-btn::after{content:"→";font-weight:400;transition:transform .18s ease}
.td-btn:hover{background:var(--coral);color:var(--ink);border-color:var(--ink)}
.td-btn:hover::after{transform:translateX(4px)}
.td-btn:active{background:var(--lime)}
.td-btn:focus-visible{outline:3px solid var(--coral);outline-offset:3px}
.td-ghost{background:transparent;color:var(--ink)}
.td-ghost::after{content:none}
.td-ghost::before{content:"←";font-weight:400}
.td-ghost:hover{background:var(--ink);color:var(--paper)}
.td-choice{display:flex;flex-wrap:wrap;gap:.75rem;width:100%;margin:1rem 0 0;padding:1.5rem 0 0;border:0;border-top:1px dashed var(--ink)}
.td-choice legend{float:left;width:100%;margin-bottom:1rem;padding:0;font-size:.72rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
.td-choice .td-btn{flex:1 1 260px;justify-content:space-between;background:var(--paper);color:var(--ink)}
.td-choice .td-btn:hover{background:var(--lime)}
.td-summary{margin-top:clamp(1rem,3vw,2rem);border-top:1px solid var(--ink)}
.td-summary>p{font-size:clamp(1.4rem,3vw,2.4rem);line-height:1.1;letter-spacing:-.03em;margin:1.5rem 0 2rem;max-width:22ch}
.td-summary ol{list-style:none;counter-reset:td;margin:0;padding:0}
.td-summary ol>li{counter-increment:td;display:grid;grid-template-columns:clamp(3rem,10vw,7rem) 1fr;gap:1rem;align-items:baseline;padding:1.25rem 0;border-bottom:1px solid var(--rule);font-size:clamp(1rem,1.5vw,1.2rem);line-height:1.5;max-width:68rem}
.td-summary ol>li::before{content:counter(td,decimal-leading-zero);font-size:clamp(2rem,5vw,3.75rem);font-weight:700;letter-spacing:-.05em;line-height:1;color:var(--ink)}
.td-summary ol>li:last-child::before{color:var(--coral);-webkit-text-stroke:1px var(--ink)}
.td-practice{max-width:68rem;margin:4rem 0 0;padding:2rem;background:var(--ink);color:var(--paper)}
.td-practice label{display:block;max-width:28ch;font-size:clamp(1.5rem,3vw,2.5rem);font-weight:700;line-height:1.1;letter-spacing:-.04em;margin-bottom:1.5rem}
.td-practice textarea{display:block;width:100%;resize:vertical;background:var(--paper);color:var(--ink);border:2px solid var(--lime);border-radius:0;padding:1rem;font:inherit;line-height:1.5}
.td-practice textarea:focus-visible{outline:3px solid var(--coral);outline-offset:4px}
.td-practice p{margin:1.5rem 0 .5rem;color:var(--lime);font-weight:700}.td-practice ul{margin:0;padding-left:1.2rem;line-height:1.6}
.td-hint{margin:1.5rem 0 0;font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:.75rem;letter-spacing:.02em;color:var(--mute)}
.td-mobile-flow{display:none}
@media (max-width:640px){
.td-title{letter-spacing:-.045em;max-width:none}
.td-story{padding-left:.75rem}
.td-diagram{display:none}
.td-mobile-flow{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px;margin:0 calc(-1 * clamp(1rem,6vw,6rem));padding:20px;background:var(--ink);color:var(--paper)}
.td-mobile-flow>div{min-height:84px;border:1px solid #f2f0e955;padding:12px;display:flex;flex-direction:column;justify-content:space-between;gap:8px}
.td-mobile-flow strong{font-size:14px;line-height:1.1}.td-mobile-flow span{font:11px/1.2 ui-monospace,monospace}
.td-mobile-flow .td-bad{background:var(--coral);color:var(--ink);border-color:var(--coral)}.td-mobile-flow .td-ok,.td-mobile-flow .td-mobile-ok{border-color:var(--lime)}.td-mobile-flow .td-mobile-idle{opacity:.45}
.td-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}
.td-metric{min-height:7.5rem;gap:1rem;padding:.8rem}
.td-metric dd{font-size:clamp(1.15rem,5vw,1.75rem);overflow-wrap:anywhere}
.td-metric dt{font-size:.62rem}
.td-actions{flex-direction:column;align-items:stretch}
.td-btn{width:100%;justify-content:space-between}
.td-ghost{justify-content:flex-start}
.td-summary ol>li{grid-template-columns:2.75rem 1fr;gap:.75rem}
}
@media (prefers-reduced-motion:reduce){.td-flow{animation:none;stroke-dasharray:none}.td-btn,.td-btn::after{transition:none}.td-btn:hover::after{transform:none}}
@media (forced-colors:active){.td-btn{border:1px solid ButtonText}.td-metric.td-bad{outline:2px solid Highlight}}
`;
