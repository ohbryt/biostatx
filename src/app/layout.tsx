import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BioStatX - Biomedical Statistics Made Simple",
  description:
    "Affordable, no-code statistical analysis for biomedical researchers. T-test, ANOVA, Chi-square, Sample Size Calculator & more.",
  keywords: [
    "biomedical statistics",
    "statistical analysis",
    "t-test",
    "ANOVA",
    "chi-square",
    "sample size calculator",
    "biomedical research",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
