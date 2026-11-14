# Learnwith 3D rebuild brief

You are the lead creative developer. The user rejected the current Learnwith UI as basic and specifically pointed to `E:\AiAlphaTech\lynx-ai-landing` as the standard for how its 3D projects are made. Inspect that project before coding. This is a design and implementation task, not a critique-only task.

## Inspect first

- `E:\AiAlphaTech\lynx-ai-landing\src\scene\Experience.tsx`, `Effects.tsx`, `LoadingBay.tsx`, `Truck.tsx`, `src\App.tsx`, `src\index.css`.
- `E:\AiAlphaTech\lynx-ai-landing\output\qa-ref\desk_000.png` and `mob_000.png` for composition; `desk_050.png` for the scene transformation.
- Its `AGENTS.md` and relevant Next docs. Do not edit the Lynx repo or reuse its product copy/assets.
- Current `D:\learnwith` sources, `AGENTS.md`, and package.json.

The lesson from Lynx is the technique: one coherent spatial scene with carefully modeled geometry, 3/4 camera framing, purposeful lighting and shadows, restrained effects, 3D motion that explains the product, and HTML copy composed with the scene. Do not copy its monochrome industrial aesthetic or scroll sequence mechanically.

## User's Learnwith direction

An interactive learning platform introduced by reels. A magical notebook inspired by the Minecraft enchanting table: a credible stylized table with an open book floating above it, and **topic objects emerging from its pages to explain concepts**. Options: System Design and Avalanche Blockchain. A simpler usable mobile version. Static Next.js export on Cloudflare Pages, installable PWA, SEO and `llms.txt` already exist. No login yet.

## What is wrong now

The current landing is a background image with a small scene in front. The book is flat, pages are boxes, the table is a rectangle, particles are random decoration, and the floating symbols are not identifiable as concepts. The lesson page reuses the same diorama without a meaningful progression. Simply adding more gradients, cards, glow, or typography will not solve this.

## Build a substantially stronger experience

1. Replace the poster-led composition with a full-viewport or dominant **real 3D environment**. The table and floating book must be the focal object at a deliberate 3/4 angle. Model the enchanting table as a recognizable, polished stylized object, with obsidian body, teal corner crystals, red cloth, gilded detail, and proper depth. Model the book with visible layered pages and convincing open shape; animate a page turn or open/reveal transition.
2. Create two distinct emerging 3D concept sequences, with geometry that means something: System Design is device → server → database with a packet traveling between them; Avalanche is wallet → network → validators with a transaction pulse. Labels and explanatory HTML must sync to the active object. Clicking or tapping objects changes the explanation. Keyboard-accessible HTML controls remain available.
3. Use the Lynx rendering approach where useful: `@react-three/fiber`, `drei` Environment/Lightformer or ContactShadows, ACES tone mapping, soft shadows, restrained postprocessing. These dependencies are installed. Keep rendering credible and performant; avoid cheap bloom, random sparkles, and gratuitous motion. Camera should not spin continuously. The scene should occupy most of the first viewport, with heading/selector/CTA composed around it rather than a separate card stack.
4. Mobile must have a deliberate simpler scene or fallback, still showing the book/table identity; full-width accessible controls and no horizontal overflow. Respect reduced motion. Handle unavailable WebGL without a blank hero. Preserve static export, PWA, SEO, lesson routes, quiz behavior, and no-login flow.
5. Replace or remove `public/study.webp` if it undermines the real 3D environment. Keep repository changes focused. You may add a few scene source files if it improves clarity. Do not edit Lynx, commit, or push.

## Acceptance bar

- It must look and behave like a purpose-built 3D project, not a landing page with a tiny Canvas.
- A visitor understands the visible 3D object chain for each topic without guessing from random geometric symbols.
- Desktop ~1440px and phone ~390px layouts must both be convincing; the primary CTA must be discoverable.
- `npm run lint` and `npm run build` pass. Do not claim browser validation unless performed.
- Leave a short summary of the files changed, the interaction flow, performance decisions, and any remaining limits.
