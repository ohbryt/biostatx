"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, loading } = useAuth();

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
            <Link href="/tools/bioplot" className="text-sm text-orange-600 font-medium hover:text-orange-700 transition-colors">
              BioPlot
            </Link>
            <Link href="/tools/curve-fitting" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
              Curve Fit
            </Link>
            <Link href="/tools/figure-gen" className="text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors">
              AI Figure
            </Link>
            <Link href="/examples" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
              Examples
            </Link>
            <Link href="/pricing" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
              Pricing
            </Link>

            {/* Auth buttons */}
            {loading ? (
              <div className="w-20 h-8 bg-stone-100 rounded-lg animate-pulse" />
            ) : user ? (
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-orange-600 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
                  {(profile?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                </div>
                <span className="hidden lg:inline">
                  {profile?.full_name || user.email?.split("@")[0]}
                </span>
                {profile?.plan && profile.plan !== "free" && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                    profile.plan === "team" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {profile.plan}
                  </span>
                )}
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-medium">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm !py-2 !px-5">
                  Get Started Free
                </Link>
              </div>
            )}
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
            <Link href="/tools/bioplot" className="block py-2 text-orange-600 font-medium hover:text-orange-700" onClick={() => setMenuOpen(false)}>BioPlot</Link>
            <Link href="/tools/curve-fitting" className="block py-2 text-stone-600 hover:text-stone-900" onClick={() => setMenuOpen(false)}>Curve Fit</Link>
            <Link href="/tools/figure-gen" className="block py-2 text-purple-600 font-medium hover:text-purple-700" onClick={() => setMenuOpen(false)}>AI Figure</Link>
            <Link href="/examples" className="block py-2 text-stone-600 hover:text-stone-900" onClick={() => setMenuOpen(false)}>Examples</Link>
            <Link href="/pricing" className="block py-2 text-stone-600 hover:text-stone-900" onClick={() => setMenuOpen(false)}>Pricing</Link>
            <div className="border-t border-stone-200 pt-3 mt-2">
              {user ? (
                <Link href="/dashboard" className="flex items-center gap-2 py-2 text-stone-700 font-medium" onClick={() => setMenuOpen(false)}>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
                    {(profile?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                  </div>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="block py-2 text-stone-600 hover:text-stone-900 font-medium" onClick={() => setMenuOpen(false)}>Sign In</Link>
                  <Link href="/auth/signup" className="btn-primary text-sm !py-2 !px-5 inline-block mt-2" onClick={() => setMenuOpen(false)}>Get Started Free</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
