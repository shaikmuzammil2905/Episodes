import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://thestorynovels.com'),
  title: "StoryEpisodes — Read • Explore • Keep Coming Back",
  description:
    "Discover captivating stories told one episode at a time. Explore genres, follow your favourite worlds, and keep coming back for the next chapter.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "StoryEpisodes — Read • Explore • Keep Coming Back",
    description:
      "Discover captivating stories told one episode at a time. Explore genres, follow your favourite worlds, and keep coming back for the next chapter.",
    type: "website",
    siteName: "StoryEpisodes",
    url: "https://thestorynovels.com",
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
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
