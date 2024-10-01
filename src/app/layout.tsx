// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "@/components/Provider";
import DemoImage from "@/assets/images/demo.png";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const BASE_URL = "https://solis.eco";

export const metadata: Metadata = {
  title: "Solis",
  description: "Learn anything in 3 minutes with AI-powered tools",
  keywords: "learning AI, learning anything in 3 minutes, AI tools, quick learning",
  author: "Solis Team",
  viewport: "width=device-width, initial-scale=1",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Solis",
    description: "Learn anything in 3 minutes with AI-powered tools",
    images: [
      {
        url: `${BASE_URL}${DemoImage.src}`,
        width: 800,
        height: 600,
        alt: "Solis Demo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Solis",
    title: "Solis",
    description: "Learn anything in 3 minutes with AI-powered tools",
    image: `${BASE_URL}${DemoImage.src}`,
  },
  facebook: {
    title: "Solis",
    description: "Learn anything in 3 minutes with AI-powered tools",
    image: `${BASE_URL}${DemoImage.src}`,
    url: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <Provider>
          <body className={inter.className}>
            {children}
            <SpeedInsights />
            <Analytics />
            <Script
              id="clarity-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "nkmyi981yh");`,
              }}
            />
          </body>
        </Provider>
      </html>
    </ClerkProvider>
  );
}
