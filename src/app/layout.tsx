import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://learnwith.abhijeetkakade.in"),
  title: { default: "Learnwith | Interactive Tech Lessons", template: "%s | Learnwith" },
  description: "Understand system design and Avalanche blockchain through short interactive lessons, then practise explaining what you learned. No account needed.",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: { title: "Learnwith | Interactive Tech Lessons", description: "See it, try it, then explain it. Short interactive lessons in system design and Avalanche.", url: "/", siteName: "Learnwith", type: "website" },
  twitter: { card: "summary", title: "Learnwith | Interactive Tech Lessons", description: "See it, try it, then explain it. Short interactive lessons in system design and Avalanche." },
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
