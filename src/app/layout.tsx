import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://learnwith.abhijeetkakade.in"),
  title: { default: "Learnwith | Break It. Fix It. Explain It.", template: "%s | Learnwith" },
  description: "Learn system design by running a ticket-drop simulation. Break the system, fix its bottlenecks, and practise an interview answer. No account needed.",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: { title: "Learnwith | Break It. Fix It. Explain It.", description: "A playable system design lesson: save a ticket site and explain your decisions.", url: "/", siteName: "Learnwith", type: "website" },
  twitter: { card: "summary", title: "Learnwith | Break It. Fix It. Explain It.", description: "A playable system design lesson: save a ticket site and explain your decisions." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "Learnwith", url: "https://learnwith.abhijeetkakade.in", description: "Interactive lessons in system design and Avalanche blockchain", author: { "@type": "Person", name: "Abhijeet Kakade" } }) }} />
        <script dangerouslySetInnerHTML={{ __html: "if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'))" }} />
      </body>
    </html>
  );
}
