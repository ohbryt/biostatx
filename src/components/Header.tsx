"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[rgba(10,15,28,0.8)] border-b border-[rgba(59,130,246,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm">
              Bx
            </div>
            <span className="font-bold text-lg">
              Bio<span className="text-blue-400">StatX</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#tools" className="text-sm text-slate-300 hover:text-white transition-colors">
              Tools
            </Link>
            <Link href="/pricing" className="text-sm text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <a href="https://github.com" target="_blank" className="text-sm text-slate-300 hover:text-white transition-colors">
              Docs
            </a>
            <Link href="/pricing" className="btn-primary text-sm !py-2 !px-5">
              Get Started Free
            </Link>
          </nav>

          <button
            className="md:hidden text-slate-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/#tools" className="block py-2 text-slate-300 hover:text-white" onClick={() => setMenuOpen(false)}>Tools</Link>
            <Link href="/pricing" className="block py-2 text-slate-300 hover:text-white" onClick={() => setMenuOpen(false)}>Pricing</Link>
            <Link href="/pricing" className="btn-primary text-sm !py-2 !px-5 inline-block mt-2" onClick={() => setMenuOpen(false)}>Get Started Free</Link>
          </div>
        )}
      </div>
    </header>
  );
}
