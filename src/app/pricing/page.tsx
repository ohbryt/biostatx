"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import * as PortOne from "@portone/browser-sdk/v2";

/* ═══ Plan Definitions ═══ */
const plans = [
  {
    name: "Free",
    nameKo: "무료",
    price: "₩0",
    priceUSD: "$0",
    period: "영구 무료",
    amountKRW: 0,
    description: "학생 및 기본 통계 분석에 적합",
    features: [
      "T-Test (Independent & Paired)",
      "One-Way ANOVA",
      "Chi-Square Test",
      "Pearson Correlation",
      "Mann-Whitney U Test",
      "Sample Size Calculator",
      "RT-PCR ΔΔCt Analysis",
      "BioPlot 기본 차트 (6종)",
      "PNG 다운로드 (1x 해상도)",
      "커뮤니티 지원",
    ],
    limitations: [
      "AI Figure Generator 사용 불가",
      "Curve Fitting 기본 3 모델만",
      "SVG 내보내기 불가",
      "분석 기록 저장 불가",
    ],
    cta: "무료로 시작",
    planKey: "free" as const,
    highlight: false,
    icon: "🆓",
  },
  {
    name: "Pro",
    nameKo: "프로",
    price: "₩12,900",
    priceUSD: "≈ $9.99",
    period: "/월",
    amountKRW: 12900,
    description: "연구자 및 대학원생을 위한 완전한 분석 도구",
    features: [
      "Free 플랜의 모든 기능 포함",
      "Kaplan-Meier Survival Analysis",
      "Curve Fitting 전체 9 모델",
      "AI Figure Generator (월 50회)",
      "AI 결과 해석 리포트",
      "SVG 벡터 내보내기",
      "PNG 2x Retina 고해상도",
      "분석 기록 저장 & 불러오기",
      "Multiple Comparisons (Tukey, Bonferroni)",
      "우선 이메일 지원 (24시간 내 응답)",
    ],
    limitations: [],
    cta: "Pro 구독하기",
    planKey: "pro" as const,
    highlight: true,
    icon: "⚡",
  },
  {
    name: "Team",
    nameKo: "팀",
    price: "₩39,900",
    priceUSD: "≈ $29.99",
    period: "/월",
    amountKRW: 39900,
    description: "연구실 및 기관을 위한 협업 플랜",
    features: [
      "Pro 플랜의 모든 기능 포함",
      "최대 10명 팀원 계정",
      "AI Figure Generator (월 200회)",
      "공유 분석 워크스페이스",
      "팀 관리 대시보드",
      "Batch 일괄 분석",
      "커스텀 브랜딩 & 로고",
      "API 액세스 (REST)",
      "전담 지원 & SSO",
      "HIPAA 준수 데이터 관리",
    ],
    limitations: [],
    cta: "Team 구독하기",
    planKey: "team" as const,
    highlight: false,
    icon: "🏢",
  },
];

/* ═══ Feature Comparison Table ═══ */
const comparisonCategories = [
  {
    category: "📊 통계 분석",
    features: [
      { name: "Independent T-Test (Welch's)", free: true, pro: true, team: true },
      { name: "One-Way ANOVA + Post-hoc", free: true, pro: true, team: true },
      { name: "Chi-Square Test", free: true, pro: true, team: true },
      { name: "Pearson Correlation", free: true, pro: true, team: true },
      { name: "Mann-Whitney U Test", free: true, pro: true, team: true },
      { name: "Sample Size Calculator", free: true, pro: true, team: true },
      { name: "RT-PCR ΔΔCt (Livak, Pfaffl)", free: true, pro: true, team: true },
      { name: "Kaplan-Meier Survival Analysis", free: false, pro: true, team: true },
      { name: "Multiple Comparisons (Tukey, Bonferroni)", free: false, pro: true, team: true },
    ],
  },
  {
    category: "📈 커브 피팅",
    features: [
      { name: "Linear / Polynomial 회귀", free: true, pro: true, team: true },
      { name: "Exponential 모델", free: true, pro: true, team: true },
      { name: "4PL Dose-Response", free: false, pro: true, team: true },
      { name: "Michaelis-Menten", free: false, pro: true, team: true },
      { name: "Hill Equation", free: false, pro: true, team: true },
      { name: "Gaussian / Log-Normal", free: false, pro: true, team: true },
      { name: "Power Law / Gompertz", free: false, pro: true, team: true },
      { name: "R², RMSE, AIC 통계량", free: true, pro: true, team: true },
    ],
  },
  {
    category: "🧬 BioPlot 시각화",
    features: [
      { name: "Volcano Plot", free: true, pro: true, team: true },
      { name: "Heatmap", free: true, pro: true, team: true },
      { name: "PCA Plot", free: true, pro: true, team: true },
      { name: "ROC Curve", free: true, pro: true, team: true },
      { name: "Box Plot", free: true, pro: true, team: true },
      { name: "GO Enrichment Bubble", free: true, pro: true, team: true },
      { name: "차트 커스터마이징 (색상, 폰트, 그리드)", free: true, pro: true, team: true },
      { name: "PNG 2x Retina 고해상도 내보내기", free: false, pro: true, team: true },
      { name: "SVG 벡터 내보내기", free: false, pro: true, team: true },
    ],
  },
  {
    category: "🎨 AI Figure Generator",
    features: [
      { name: "Text-to-Figure (DALL-E 3)", free: false, pro: "월 50회", team: "월 200회" },
      { name: "6가지 스타일 (Scientific, Diagram, Molecular 등)", free: false, pro: true, team: true },
      { name: "HD 품질 (1792×1024)", free: false, pro: true, team: true },
      { name: "3가지 사이즈 (Square, Landscape, Portrait)", free: false, pro: true, team: true },
      { name: "프롬프트 히스토리", free: false, pro: true, team: true },
    ],
  },
  {
    category: "💾 데이터 & 협업",
    features: [
      { name: "브라우저 내 계산 (데이터 서버 미전송)", free: true, pro: true, team: true },
      { name: "분석 기록 저장 & 불러오기", free: false, pro: true, team: true },
      { name: "AI 결과 해석 리포트", free: false, pro: true, team: true },
      { name: "팀 워크스페이스 & 공유", free: false, pro: false, team: true },
      { name: "Batch 일괄 분석", free: false, pro: false, team: true },
      { name: "REST API 액세스", free: false, pro: false, team: true },
      { name: "커스텀 브랜딩 & 로고", free: false, pro: false, team: true },
      { name: "SSO (Single Sign-On)", free: false, pro: false, team: true },
      { name: "HIPAA 준수 데이터 관리", free: false, pro: false, team: true },
    ],
  },
  {
    category: "🛟 지원",
    features: [
      { name: "커뮤니티 포럼", free: true, pro: true, team: true },
      { name: "이메일 지원", free: false, pro: "24시간 내 응답", team: "4시간 내 응답" },
      { name: "전담 매니저", free: false, pro: false, team: true },
      { name: "온보딩 지원 (Zoom)", free: false, pro: false, team: true },
    ],
  },
];

/* ═══ Use Cases ═══ */
const useCases = [
  {
    plan: "Free",
    icon: "🎓",
    title: "학생 & 입문자",
    desc: "학부 과제, 석사 논문 기초 통계에 적합합니다.",
    examples: ["학위 논문 T-Test", "수업 과제 ANOVA", "기초 상관분석"],
    color: "border-stone-300 bg-stone-50",
  },
  {
    plan: "Pro",
    icon: "🔬",
    title: "연구자 & 대학원생",
    desc: "SCI 논문 작성, 고급 분석, AI 기능이 필요한 연구자.",
    examples: ["SCI 논문 통계 분석", "생존 분석 & 커브 피팅", "AI Figure로 Graphical Abstract 제작"],
    color: "border-orange-300 bg-orange-50",
  },
  {
    plan: "Team",
    icon: "🏥",
    title: "연구실 & 기관",
    desc: "팀 단위 분석, API 연동, 기관 보안 요구사항 충족.",
    examples: ["연구실 공유 워크스페이스", "임상시험 데이터 Batch 분석", "기관 SSO & HIPAA 준수"],
    color: "border-purple-300 bg-purple-50",
  },
];

/* ═══ Competitor Comparison ═══ */
const competitors = [
  { name: "SPSS", price: "₩130,000+/월", tools: "통계 전문", figure: "없음", cloud: "❌ 설치 필요" },
  { name: "GraphPad Prism", price: "₩350,000+/년", tools: "통계+시각화", figure: "없음", cloud: "❌ 설치 필요" },
  { name: "SAS", price: "₩10,000,000+/년", tools: "통계 전문", figure: "없음", cloud: "❌ 서버 필요" },
  { name: "FigureLabs", price: "₩12,000+/월", tools: "없음", figure: "AI Figure만", cloud: "✅ 웹" },
  { name: "BioStatX Pro", price: "₩12,900/월", tools: "통계+시각화+커브피팅", figure: "AI Figure 포함", cloud: "✅ 웹 (설치 불요)", highlight: true },
];

/* ═══ FAQs ═══ */
const faqs = [
  {
    q: "무료 플랜으로 논문에 사용할 수 있나요?",
    a: "네! 무료 플랜도 모든 기본 통계 테스트를 제공하며, 결과를 논문에 인용할 수 있습니다. Methods에 'Statistical analyses were performed using BioStatX (biostatx.com)' 으로 기재하시면 됩니다.",
  },
  {
    q: "Pro와 Team의 차이점은 무엇인가요?",
    a: "Pro는 개인 연구자를 위한 플랜으로 모든 분석 도구와 AI Figure Generator를 월 50회 사용할 수 있습니다. Team은 연구실/기관용으로 최대 10명의 팀원, 공유 워크스페이스, API, SSO, HIPAA 준수를 제공합니다.",
  },
  {
    q: "AI Figure Generator는 어떻게 작동하나요?",
    a: "텍스트로 원하는 과학 일러스트레이션을 설명하면 AI가 출판 수준의 고품질 과학 그림을 생성합니다. Cell Pathway, Graphical Abstract, Molecular Diagram 등 6가지 스타일을 지원하며, DALL-E 3 HD 모델을 사용합니다.",
  },
  {
    q: "결과의 정확도는 SPSS나 R과 비교했을 때 어떤가요?",
    a: "BioStatX는 SPSS, R과 동일한 수학적 알고리즘(Welch's t-test, Levenberg-Marquardt 등)을 사용합니다. 공개 레퍼런스 데이터셋으로 검증되었으며 99.9% 정확도를 보장합니다.",
  },
  {
    q: "내 데이터는 안전한가요?",
    a: "모든 통계 계산은 브라우저에서 직접 수행됩니다 — 데이터가 서버로 전송되지 않습니다. AI Figure Generator만 서버를 경유하며, 입력 프롬프트는 저장하지 않습니다. Pro 이상에서는 저장된 분석이 암호화됩니다.",
  },
  {
    q: "구독을 언제든 취소할 수 있나요?",
    a: "네. Pro 또는 Team 구독은 언제든 취소할 수 있으며, 결제 기간이 끝날 때까지 모든 기능을 계속 사용할 수 있습니다. 7일 이내 미사용 시 전액 환불도 가능합니다.",
  },
  {
    q: "어떤 결제 수단을 지원하나요?",
    a: "신용카드, 체크카드, 계좌이체, 카카오페이를 지원합니다. 결제는 PortOne(포트원)을 통해 안전하게 처리되며, PCI-DSS 인증을 받은 결제 시스템입니다.",
  },
  {
    q: "학생 할인이 있나요?",
    a: "현재 무료 플랜이 학생을 위한 최적의 옵션입니다. 기본 통계 테스트 7종 + RT-PCR + BioPlot을 무료로 제공합니다. 추후 학생 할인 프로그램 도입을 검토 중입니다.",
  },
];

export default function PricingPage() {
  const { user, profile } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const handleCheckout = async (planKey: string, amountKRW: number, planName: string) => {
    if (!user) {
      window.location.href = "/auth/signup";
      return;
    }
    if (planKey === "free") {
      window.location.href = "/dashboard";
      return;
    }

    setLoadingPlan(planKey);
    try {
      const paymentId = `payment-${crypto.randomUUID()}`;
      const response = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID || "",
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || "",
        paymentId,
        orderName: `BioStatX ${planName} Plan (Monthly)`,
        totalAmount: amountKRW,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
        customData: { userId: user.id, planKey },
        redirectUrl: `${window.location.origin}/dashboard?checkout=success&planKey=${planKey}&paymentId=${paymentId}`,
      });

      if (response && response.code !== undefined) {
        if (response.code === "FAILURE_TYPE_PG") {
          alert("결제가 실패했습니다. 다시 시도해 주세요.");
        }
      } else {
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, userId: user.id, planKey }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          window.location.href = "/dashboard?checkout=success";
        } else {
          alert("결제 확인에 실패했습니다. 고객지원에 문의해 주세요.");
        }
      }
    } catch {
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const isCurrentPlan = (planKey: string) => {
    if (!user) return false;
    return profile?.plan === planKey || (!profile?.plan && planKey === "free");
  };

  const getButtonLabel = (plan: typeof plans[0]) => {
    if (loadingPlan === plan.planKey) return "처리 중...";
    if (isCurrentPlan(plan.planKey)) return "✓ 현재 플랜";
    return plan.cta;
  };

  const renderCheck = (val: boolean | string) => {
    if (val === true) return <span className="text-green-600 font-bold">✓</span>;
    if (val === false) return <span className="text-stone-300">—</span>;
    return <span className="text-orange-600 text-xs font-semibold">{val}</span>;
  };

  return (
    <>
      <Header />
      <main className="pt-28 pb-10 px-4">
        <div className="max-w-6xl mx-auto">

          {/* ═══ Hero ═══ */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-xs text-orange-700 mb-6 uppercase tracking-wider font-medium">
              💰 요금제 안내
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-stone-800">
              연구에 집중하세요. <span className="gradient-text">가격은 간단하게.</span>
            </h1>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
              숨겨진 비용 없이 투명한 가격. 무료로 시작하고 필요할 때 업그레이드하세요.
              <br />
              <span className="text-sm text-stone-400">SPSS ₩130,000/월, Prism ₩350,000/년 대비 최대 90% 절감</span>
            </p>
          </div>

          {/* ═══ Annual Savings Banner ═══ */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-50 border border-green-200 text-sm text-green-700">
              <span className="font-bold">🎉 연간 구독 시 2개월 무료</span>
              <span className="text-green-600 text-xs">(Pro ₩129,000/년 · Team ₩399,000/년)</span>
            </div>
          </div>

          {/* ═══ Plan Cards ═══ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`glass-card p-8 flex flex-col ${
                  plan.highlight ? "!border-orange-400/50 relative ring-2 ring-orange-200" : ""
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-xs font-bold text-white shadow-lg">
                    🔥 가장 인기
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{plan.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-stone-800">{plan.name}</h3>
                    <p className="text-xs text-stone-400">{plan.nameKo}</p>
                  </div>
                </div>

                <div className="mt-2 mb-2">
                  <span className="text-4xl font-extrabold text-stone-900">{plan.price}</span>
                  <span className="text-stone-500 text-sm ml-1">{plan.period}</span>
                </div>
                <p className="text-xs text-stone-400 mb-1">{plan.priceUSD} USD</p>
                <p className="text-sm text-stone-600 mb-5 font-medium">{plan.description}</p>

                {/* CTA Button */}
                {isCurrentPlan(plan.planKey) ? (
                  <div className="text-center py-3 rounded-xl bg-green-50 text-green-600 font-semibold text-sm border border-green-200 mb-5">
                    ✓ 현재 플랜
                  </div>
                ) : (
                  <button
                    onClick={() => handleCheckout(plan.planKey, plan.amountKRW, plan.name)}
                    disabled={!!loadingPlan}
                    className={`text-center w-full mb-5 ${plan.highlight ? "btn-primary" : "btn-secondary"} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {getButtonLabel(plan)}
                  </button>
                )}

                {/* Features */}
                <ul className="space-y-2.5 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5 shrink-0 text-xs">✓</span>
                      <span className="text-stone-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-stone-100">
                    {plan.limitations.map((lim, i) => (
                      <p key={i} className="flex items-start gap-2 text-xs text-stone-400 mb-1.5">
                        <span className="shrink-0">✕</span>
                        {lim}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ═══ Use Cases ═══ */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8 text-stone-800">
              어떤 플랜이 <span className="gradient-text">나에게 맞을까?</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {useCases.map((uc) => (
                <div key={uc.plan} className={`rounded-2xl border-2 ${uc.color} p-6`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{uc.icon}</span>
                    <div>
                      <h3 className="font-bold text-stone-800">{uc.title}</h3>
                      <span className="text-xs font-semibold text-orange-600">{uc.plan} 추천</span>
                    </div>
                  </div>
                  <p className="text-sm text-stone-600 mb-4">{uc.desc}</p>
                  <div className="space-y-1.5">
                    {uc.examples.map((ex, i) => (
                      <div key={i} className="text-xs text-stone-500 flex items-center gap-1.5">
                        <span className="text-orange-400">→</span> {ex}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ Feature Comparison Toggle ═══ */}
          <section className="mb-16">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-stone-800 mb-2">
                기능 <span className="gradient-text">상세 비교</span>
              </h2>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="text-sm text-orange-600 font-medium hover:text-orange-700 transition underline underline-offset-2"
              >
                {showComparison ? "비교표 접기 ▲" : "전체 비교표 보기 ▼"}
              </button>
            </div>

            {showComparison && (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-stone-200 bg-stone-50">
                        <th className="text-left py-3 px-4 text-stone-600 font-semibold min-w-[240px]">기능</th>
                        <th className="text-center py-3 px-4 text-stone-600 font-semibold w-24">Free</th>
                        <th className="text-center py-3 px-4 font-semibold w-24 text-orange-700 bg-orange-50/50">Pro</th>
                        <th className="text-center py-3 px-4 text-stone-600 font-semibold w-24">Team</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonCategories.map((cat) => (
                        <>
                          <tr key={cat.category} className="bg-stone-50/50">
                            <td colSpan={4} className="py-2.5 px-4 text-xs font-bold text-stone-700 uppercase tracking-wider">
                              {cat.category}
                            </td>
                          </tr>
                          {cat.features.map((f, i) => (
                            <tr key={`${cat.category}-${i}`} className="border-b border-stone-100 hover:bg-stone-50/30 transition">
                              <td className="py-2 px-4 text-stone-600">{f.name}</td>
                              <td className="py-2 px-4 text-center">{renderCheck(f.free)}</td>
                              <td className="py-2 px-4 text-center bg-orange-50/20">{renderCheck(f.pro)}</td>
                              <td className="py-2 px-4 text-center">{renderCheck(f.team)}</td>
                            </tr>
                          ))}
                        </>
                      ))}
                      <tr className="border-t-2 border-stone-200 bg-stone-50 font-bold">
                        <td className="py-3 px-4 text-stone-800">월 가격</td>
                        <td className="py-3 px-4 text-center text-stone-600">₩0</td>
                        <td className="py-3 px-4 text-center text-orange-700 bg-orange-50/50">₩12,900</td>
                        <td className="py-3 px-4 text-center text-stone-600">₩39,900</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* ═══ Competitor Comparison ═══ */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-2 text-stone-800">
              경쟁 소프트웨어 <span className="gradient-text">가격 비교</span>
            </h2>
            <p className="text-center text-sm text-stone-400 mb-8">동일한 정확도, 훨씬 저렴한 가격</p>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-stone-200 bg-stone-50">
                      <th className="text-left py-3 px-4 text-stone-600 font-semibold">소프트웨어</th>
                      <th className="text-left py-3 px-4 text-stone-600 font-semibold">가격</th>
                      <th className="text-left py-3 px-4 text-stone-600 font-semibold">통계 도구</th>
                      <th className="text-left py-3 px-4 text-stone-600 font-semibold">AI Figure</th>
                      <th className="text-left py-3 px-4 text-stone-600 font-semibold">클라우드</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitors.map((c) => (
                      <tr key={c.name} className={`border-b border-stone-100 ${c.highlight ? "bg-orange-50/40" : ""}`}>
                        <td className={`py-3 px-4 font-semibold ${c.highlight ? "text-orange-700" : "text-stone-700"}`}>
                          {c.highlight && "⭐ "}{c.name}
                        </td>
                        <td className={`py-3 px-4 font-mono ${c.highlight ? "text-orange-700 font-bold" : "text-stone-600"}`}>{c.price}</td>
                        <td className="py-3 px-4 text-stone-600">{c.tools}</td>
                        <td className="py-3 px-4 text-stone-600">{c.figure}</td>
                        <td className="py-3 px-4 text-stone-600">{c.cloud}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ═══ Payment Methods ═══ */}
          <section className="mb-16">
            <div className="glass-card p-8 text-center">
              <h3 className="font-bold text-stone-800 mb-4">🔒 안전한 결제</h3>
              <p className="text-sm text-stone-500 mb-5">
                모든 결제는 <strong className="text-stone-700">PortOne(포트원)</strong>을 통해 PCI-DSS 인증 환경에서 안전하게 처리됩니다.
              </p>
              <div className="flex items-center justify-center flex-wrap gap-3">
                <span className="text-xs font-medium px-4 py-2 rounded-full bg-stone-100 text-stone-600">💳 신용카드 / 체크카드</span>
                <span className="text-xs font-medium px-4 py-2 rounded-full bg-stone-100 text-stone-600">🏦 계좌이체</span>
                <span className="text-xs font-medium px-4 py-2 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">📱 카카오페이</span>
                <span className="text-xs font-medium px-4 py-2 rounded-full bg-stone-100 text-stone-600">🍎 Apple Pay</span>
              </div>
              <div className="mt-5 flex items-center justify-center gap-6 text-xs text-stone-400">
                <span>🔐 256-bit SSL 암호화</span>
                <span>📄 7일 내 환불 보장</span>
                <span>🔄 언제든 취소 가능</span>
              </div>
            </div>
          </section>

          {/* ═══ FAQ ═══ */}
          <section className="mb-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-10 text-stone-800">
                자주 묻는 <span className="gradient-text">질문</span>
              </h2>
              <div className="glass-card p-8">
                {faqs.map((faq, i) => (
                  <div key={i} className={i < faqs.length - 1 ? "border-b border-dashed border-stone-200 pb-5 mb-5" : ""}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between text-left gap-4"
                    >
                      <span className={`font-semibold text-[15px] transition-colors ${
                        openFaq === i ? "text-orange-700" : "text-stone-800 hover:text-orange-600"
                      }`}>
                        {faq.q}
                      </span>
                      <span className={`w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0 transition-transform ${
                        openFaq === i ? "rotate-45" : ""
                      }`}>
                        +
                      </span>
                    </button>
                    {openFaq === i && (
                      <p className="mt-3 text-sm text-stone-600 leading-relaxed pl-0.5">{faq.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ Final CTA ═══ */}
          <section className="mb-10">
            <div className="glass-card p-12 text-center relative overflow-hidden">
              <div className="glow-orb w-[300px] h-[300px] bg-orange-400 -top-32 -right-32 animate-pulse-slow" />
              <div className="glow-orb w-[200px] h-[200px] bg-amber-500 -bottom-20 -left-20 animate-pulse-slow" style={{ animationDelay: "2s" }} />
              <div className="relative z-10">
                <h2 className="text-3xl font-extrabold mb-4 text-stone-800">
                  지금 바로 <span className="gradient-text">시작하세요</span>
                </h2>
                <p className="text-stone-500 mb-8 leading-relaxed max-w-lg mx-auto">
                  신용카드 없이 무료로 시작하세요. 7개 통계 테스트 + RT-PCR + BioPlot을 바로 사용할 수 있습니다.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {user ? (
                    <Link href="/dashboard" className="btn-primary text-lg">
                      대시보드로 이동
                    </Link>
                  ) : (
                    <>
                      <Link href="/auth/signup" className="btn-primary text-lg">
                        무료 계정 만들기
                      </Link>
                      <Link href="/#tools" className="btn-secondary text-lg">
                        도구 둘러보기
                      </Link>
                    </>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-4">
                  ✓ 신용카드 불필요 · ✓ 데이터 서버 미전송 · ✓ 언제든 취소
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
