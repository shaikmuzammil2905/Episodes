import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.thestorynovels.com'),
  title: "StoryEpisodes — Read • Explore • Keep Coming Back",
  description:
    "Discover captivating stories told one episode at a time. Explore genres, follow your favourite worlds, and keep coming back for the next chapter.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.thestorynovels.com',
  },
  openGraph: {
    title: "StoryEpisodes — Read • Explore • Keep Coming Back",
    description:
      "Discover captivating stories told one episode at a time. Explore genres, follow your favourite worlds, and keep coming back for the next chapter.",
    type: "website",
    siteName: "StoryEpisodes",
    url: "https://www.thestorynovels.com",
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
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-YMKEDFWN5L"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-YMKEDFWN5L');
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

