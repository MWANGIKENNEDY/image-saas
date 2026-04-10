import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { StructuredData } from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ImageGen AI - Transform Photos with AI Art Styles | AI Image Generator",
  description:
    "Transform your photos into stunning AI art with ImageGen. Choose from 6 artistic styles including Storybook 3D, Anime, Clay Render, and more. Free tier available. Start creating in seconds.",
  keywords: [
    "AI image generator",
    "AI art generator",
    "photo to art",
    "AI photo editor",
    "image style transfer",
    "AI image transformation",
    "DALL-E",
    "AI art styles",
    "photo stylization",
  ],
  authors: [{ name: "ImageGen AI" }],
  creator: "ImageGen AI",
  publisher: "ImageGen AI",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://imagegen.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "ImageGen AI - Transform Photos with AI Art Styles",
    description:
      "Transform your photos into stunning AI art with 6 artistic styles. Free tier available.",
    siteName: "ImageGen AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ImageGen AI - AI Image Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ImageGen AI - Transform Photos with AI Art Styles",
    description:
      "Transform your photos into stunning AI art with 6 artistic styles. Free tier available.",
    images: ["/og-image.png"],
    creator: "@imagegen_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <StructuredData />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
