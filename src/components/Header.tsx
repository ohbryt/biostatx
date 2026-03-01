"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[rgba(250,248,245,0.85)] border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center font-bold text-sm text-white">
              Bx
            </div>
            <span className="font-bold text-lg text-stone-800">
              Bio<span className="text-orange-600">StatX</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#tools" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
              Tools
            </Link>
            <Link href="/examples" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
              Examples
            </Link>
            <Link href="/pricing" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
              Pricing
            </Link>
            <Link href="/pricing" className="btn-primary text-sm !py-2 !px-5">
              Get Started Free
            </Link>
          </nav>

          <button
            className="md:hidden text-stone-600"
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
            <Link href="/#tools" className="block py-2 text-stone-600 hover:text-stone-900" onClick={() => setMenuOpen(false)}>Tools</Link>
            <Link href="/examples" className="block py-2 text-stone-600 hover:text-stone-900" onClick={() => setMenuOpen(false)}>Examples</Link>
            <Link href="/pricing" className="block py-2 text-stone-600 hover:text-stone-900" onClick={() => setMenuOpen(false)}>Pricing</Link>
            <Link href="/pricing" className="btn-primary text-sm !py-2 !px-5 inline-block mt-2" onClick={() => setMenuOpen(false)}>Get Started Free</Link>
          </div>
        )}
      </div>
    </header>
  );
}
