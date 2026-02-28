import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(59,130,246,0.1)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm">
                Bx
              </div>
              <span className="font-bold text-lg">
                Bio<span className="text-blue-400">StatX</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              Affordable, no-code statistical analysis designed specifically for biomedical researchers.
              Publication-ready results in seconds, not hours.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-slate-200">Tools</h4>
            <div className="space-y-2">
              <Link href="/tools/t-test" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">T-Test</Link>
              <Link href="/tools/anova" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">ANOVA</Link>
              <Link href="/tools/chi-square" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Chi-Square</Link>
              <Link href="/tools/correlation" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Correlation</Link>
              <Link href="/tools/sample-size" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Sample Size</Link>
              <Link href="/tools/mann-whitney" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Mann-Whitney U</Link>
              <Link href="/tools/survival" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Survival Analysis</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-slate-200">Company</h4>
            <div className="space-y-2">
              <Link href="/pricing" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Pricing</Link>
              <a href="#" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Documentation</a>
              <a href="#" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Contact</a>
              <a href="#" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>

        <div className="border-t border-[rgba(59,130,246,0.1)] mt-10 pt-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} BioStatX. All rights reserved. Made for researchers, by researchers.
        </div>
      </div>
    </footer>
  );
}
