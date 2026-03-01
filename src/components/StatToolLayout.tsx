"use client";

import Header from "./Header";
import Footer from "./Footer";
import Link from "next/link";

interface StatToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function StatToolLayout({ title, description, children }: StatToolLayoutProps) {
  return (
    <>
      <Header />
      <main className="pt-24 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/#tools"
            className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-orange-600 transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Tools
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h1>
            <p className="text-stone-500">{description}</p>
          </div>

          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
