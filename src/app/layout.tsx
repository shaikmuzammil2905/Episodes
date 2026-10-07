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
          src="https://www.googletagmanager.com/gtag/js?id=G-10G1S41PC2"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-10G1S41PC2');
          `}
        </Script>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .splash-screen {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background-color: #F8FAF9 !important;
                z-index: 999999 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                opacity: 1;
                visibility: visible;
                transition: opacity 0.4s ease, visibility 0.4s ease;
                pointer-events: auto;
              }
              .splash-screen.fade-out {
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
              }
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

