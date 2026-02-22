import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import MainLayout from "@/components/Layout/MainLayout";
import { SystemProvider } from "@/contexts/SystemContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CyberSafe Campus | #include S3Pings — AI + Cybersecurity & Privacy",
  description: "AI-powered cybersecurity awareness and privacy platform for students and institutions. Phishing detection, digital hygiene, consent-first access, and explainable security — by Team #include S3Pings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <SystemProvider>
          <MainLayout>{children}</MainLayout>
        </SystemProvider>
      </body>
    </html>
  );
}
