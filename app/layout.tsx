import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingParticles from "./components/animations/FloatingParticles";
import AnimatedWrapper from "./components/AnimatedContainer";
import BackgroundEffects from "./components/BackgroundEffects";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Resume Analyzer",
  description: "Analyze your resume with AI and get instant feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <FloatingParticles />
        <BackgroundEffects /> {/* Optional: extra background glow/effects */}
        <AnimatedWrapper> {/* Optional: entry/exit animation */}
          {children}
        </AnimatedWrapper>
      </body>
    </html>
  );
}
