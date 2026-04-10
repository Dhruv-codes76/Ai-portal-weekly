import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLevelThemeController from "@/components/AppLevelThemeController";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    template: "%s | AI Portal Weekly",
    default: "AI Portal Weekly | Honest AI Tools & Intelligence for Students",
  },
  description: "The honest truth about AI for Indian freshers. We cut through the hype to help you build your career and income.",
  keywords: ["AI for Indian students", "AI tools for CSE freshers", "Tier-3 college AI prep", "Free AI tools for students India", "AI news India", "coding tools for beginners", "AI career guidance India"],
  openGraph: {
    title: "AI Portal Weekly",
    description: "Honest AI intelligence and curated tools for India's next-gen tech workforce.",
    url: "https://www.aiportalweekly.com",
    siteName: "AI Portal Weekly",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Portal Weekly",
    description: "Honest AI intelligence for Indian freshers.",
  },
  metadataBase: new URL("https://www.aiportalweekly.com"),
  alternates: {
    canonical: "https://www.aiportalweekly.com",
  },
  category: 'technology',
  classification: 'AI News and Tools Portal',

  icons: {
    icon: "/logos/favicon.ico",
    shortcut: "/logos/favicon-96x96.png",
    apple: "/logos/apple-touch-icon.png",
  },
  manifest: "/logos/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans flex flex-col min-h-[100dvh] bg-background text-foreground antialiased relative`}>
        <AppLevelThemeController>
          {children}
        </AppLevelThemeController>
      </body>
    </html>
  );
}
