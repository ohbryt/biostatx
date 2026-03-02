"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const planFeatures = {
  free: [
    "T-Test, ANOVA, Chi-Square, Correlation",
    "Mann-Whitney U Test",
    "Sample Size Calculator",
    "Basic BioPlot charts",
    "Community support",
  ],
  pro: [
    "All Free features",
    "Survival Analysis (Kaplan-Meier)",
    "Full BioPlot with customization",
    "Curve Fitting (9 models)",
    "Publication-ready export (PNG/SVG)",
    "AI-powered interpretation",
    "Data history & saved analyses",
    "Priority email support",
  ],
  team: [
    "All Pro features",
    "Up to 10 team members",
    "Shared analysis workspace",
    "API access & batch analysis",
    "Dedicated support & SSO",
    "HIPAA-ready compliance",
  ],
};

function DashboardContent() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [signingOut, setSigningOut] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Handle redirect from payment success
  useEffect(() => {
    const checkout = searchParams.get("checkout");
    const planKey = searchParams.get("planKey");
    const paymentId = searchParams.get("paymentId");

    if (checkout === "success" && planKey && paymentId && user) {
      // Verify and update plan on redirect return (mobile flow)
      fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, userId: user.id, planKey }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            refreshProfile();
            setShowCheckoutSuccess(true);
            setTimeout(() => setShowCheckoutSuccess(false), 5000);
          }
        })
        .catch(() => {});

      // Clean URL
      router.replace("/dashboard");
    } else if (checkout === "success") {
      setShowCheckoutSuccess(true);
      setTimeout(() => setShowCheckoutSuccess(false), 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-28 pb-16 px-4 min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full" />
        </main>
        <Footer />
      </>
    );
  }

  if (!user) return null;

  const currentPlan = profile?.plan || "free";
  const features = planFeatures[currentPlan] || planFeatures.free;

  return (
    <>
      <Header />
      <main className="pt-28 pb-16 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Checkout success banner */}
          {showCheckoutSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">결제가 완료되었습니다! 플랜이 업그레이드되었습니다.</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-stone-800">Dashboard</h1>
              <p className="text-stone-500 mt-1">Welcome back, {profile?.full_name || user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="text-sm px-4 py-2 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-50"
            >
              {signingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Card */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-stone-400 uppercase tracking-wider">Name</span>
                  <p className="text-stone-800 font-medium">{profile?.full_name || "Not set"}</p>
                </div>
                <div>
                  <span className="text-xs text-stone-400 uppercase tracking-wider">Email</span>
                  <p className="text-stone-800 font-medium">{user.email}</p>
                </div>
                <div>
                  <span className="text-xs text-stone-400 uppercase tracking-wider">Member Since</span>
                  <p className="text-stone-800 font-medium">
                    {new Date(profile?.created_at || user.created_at).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Subscription Card */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Subscription
              </h2>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    currentPlan === "team"
                      ? "bg-purple-100 text-purple-700"
                      : currentPlan === "pro"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-stone-100 text-stone-600"
                  }`}>
                    {currentPlan} Plan
                  </span>
                </div>
                <p className="text-sm text-stone-500 mt-2">
                  {currentPlan === "free"
                    ? "Upgrade to unlock Curve Fitting, publication-ready exports, and more."
                    : currentPlan === "pro"
                    ? "All Pro features including AI interpretation are active."
                    : "Full team access with shared workspace and API."}
                </p>
              </div>
              <div className="flex gap-2">
                {currentPlan === "free" ? (
                  <Link href="/pricing" className="btn-primary text-sm !py-2 !px-4">
                    Upgrade Plan
                  </Link>
                ) : (
                  <Link href="/pricing" className="text-sm px-4 py-2 rounded-lg border border-orange-300 text-orange-600 hover:bg-orange-50 transition-colors">
                    Manage Plan
                  </Link>
                )}
              </div>
            </div>

            {/* Plan Features */}
            <div className="glass-card p-6 md:col-span-2">
              <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Your Features ({currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 py-1.5">
                    <span className="text-green-600 mt-0.5 shrink-0">✓</span>
                    <span className="text-sm text-stone-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6 md:col-span-2">
              <h2 className="text-lg font-bold text-stone-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link href="/#tools" className="p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors text-center group">
                  <div className="text-2xl mb-1">📊</div>
                  <span className="text-sm font-medium text-stone-700 group-hover:text-orange-700">Statistical Tools</span>
                </Link>
                <Link href="/tools/bioplot" className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-center group">
                  <div className="text-2xl mb-1">🧬</div>
                  <span className="text-sm font-medium text-stone-700 group-hover:text-blue-700">BioPlot</span>
                </Link>
                <Link href="/tools/curve-fitting" className="p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors text-center group">
                  <div className="text-2xl mb-1">📈</div>
                  <span className="text-sm font-medium text-stone-700 group-hover:text-purple-700">Curve Fitting</span>
                </Link>
                <Link href="/examples" className="p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors text-center group">
                  <div className="text-2xl mb-1">📚</div>
                  <span className="text-sm font-medium text-stone-700 group-hover:text-green-700">Examples</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
