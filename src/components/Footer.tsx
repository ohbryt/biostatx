import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 mt-20 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center font-bold text-sm text-white">
                Bx
              </div>
              <span className="font-bold text-lg text-stone-800">
                Bio<span className="text-orange-600">StatX</span>
              </span>
            </div>
            <p className="text-stone-500 text-sm max-w-md">
              Affordable, no-code statistical analysis designed specifically for biomedical researchers.
              Publication-ready results in seconds, not hours.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-stone-700">Tools</h4>
            <div className="space-y-2">
              <Link href="/tools/t-test" className="block text-sm text-stone-500 hover:text-orange-600 transition-colors">T-Test</Link>
              <Link href="/tools/anova" className="block text-sm text-stone-500 hover:text-orange-600 transition-colors">ANOVA</Link>
              <Link href="/tools/chi-square" className="block text-sm text-stone-500 hover:text-orange-600 transition-colors">Chi-Square</Link>
              <Link href="/tools/correlation" className="block text-sm text-stone-500 hover:text-orange-600 transition-colors">Correlation</Link>
              <Link href="/tools/sample-size" className="block text-sm text-stone-500 hover:text-orange-600 transition-colors">Sample Size</Link>
              <Link href="/tools/mann-whitney" className="block text-sm text-stone-500 hover:text-orange-600 transition-colors">Mann-Whitney U</Link>
              <Link href="/tools/survival" className="block text-sm text-stone-500 hover:text-orange-600 transition-colors">Survival Analysis</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-stone-700">Company</h4>
            <div className="space-y-2">
              <Link href="/examples" className="block text-sm text-stone-500 hover:text-orange-600 transition-colors">Examples</Link>
              <Link href="/pricing" className="block text-sm text-stone-500 hover:text-orange-600 transition-colors">Pricing</Link>
              <a href="#" className="block text-sm text-stone-500 hover:text-orange-600 transition-colors">Documentation</a>
              <a href="mailto:brownbio.ocm@gmail.com" className="block text-sm text-stone-500 hover:text-orange-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>

        {/* Brown Biotech Inc. */}
        <div className="border-t border-stone-200 mt-10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-700 to-orange-800 flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">BB</span>
              </div>
              <div>
                <span className="text-sm font-semibold text-stone-700">Brown Biotech Inc.</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-stone-500">
              <a href="mailto:brownbio.ocm@gmail.com" className="hover:text-orange-600 transition-colors flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                brownbio.ocm@gmail.com
              </a>
            </div>
          </div>
          <p className="text-center text-xs text-stone-400 mt-6">
            &copy; {new Date().getFullYear()} Brown Biotech Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
