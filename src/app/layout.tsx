import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://learnwith.abhijeetkakade.in"),
  title: { default: "Learnwith | Interactive System Design & Avalanche Lessons", template: "%s | Learnwith" },
  description: "Explore system design and Avalanche blockchain with interactive 3D lessons and quick challenges. Learn by doing, no account needed.",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: { title: "Learnwith | Explore ideas in 3D", description: "Interactive lessons in system design and Avalanche blockchain.", url: "/", siteName: "Learnwith", type: "website" },
  twitter: { card: "summary", title: "Learnwith | Explore ideas in 3D", description: "Interactive lessons in system design and Avalanche blockchain." },
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
