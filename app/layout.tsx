import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const SITE = "https://shashwatgoyal.dev"; // TODO: set to your real domain

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Shashwat Goyal — Software Developer",
  description:
    "Software developer building scalable web applications and the backend systems that power them. Creator of TravelX, an AI travel planner.",
  keywords: [
    "Shashwat Goyal", "Software Developer", "Full Stack Developer",
    "Next.js", "React", "Node.js", "TypeScript", "Backend",
  ],
  authors: [{ name: "Shashwat Goyal" }],
  openGraph: {
    type: "website",
    url: SITE,
    title: "Shashwat Goyal — Software Developer",
    description:
      "Building scalable web applications and the backend systems that power them.",
    siteName: "Shashwat Goyal",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Shashwat Goyal — Software Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shashwat Goyal — Software Developer",
    description:
      "Building scalable web applications and the backend systems that power them.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
