import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "StoryEpisodes — Read • Explore • Keep Coming Back",
  description:
    "Discover captivating stories told one episode at a time. Explore genres, follow your favourite worlds, and keep coming back for the next chapter.",
  openGraph: {
    title: "StoryEpisodes — Read • Explore • Keep Coming Back",
    description:
      "Discover captivating stories told one episode at a time. Explore genres, follow your favourite worlds, and keep coming back for the next chapter.",
    type: "website",
    siteName: "StoryEpisodes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/logo.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
