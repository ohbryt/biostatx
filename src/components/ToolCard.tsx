import Link from "next/link";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  tag: string;
  tagColor: string;
}

export default function ToolCard({ title, description, href, icon, tag, tagColor }: ToolCardProps) {
  return (
    <Link href={href} className="group">
      <div className="glass-card p-7 h-full flex flex-col">
        {/* Top row */}
        <div className="flex items-start justify-between mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-200/30 flex items-center justify-center text-orange-600 group-hover:from-orange-500/20 group-hover:to-amber-500/20 group-hover:scale-110 transition-all duration-300">
            {icon}
          </div>
          <span
            className="text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
            style={{ background: `${tagColor}12`, color: tagColor, border: `1px solid ${tagColor}25` }}
          >
            {tag}
          </span>
        </div>

        {/* Content */}
        <h3 className="font-bold text-[17px] mb-2.5 text-stone-800 group-hover:text-orange-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-stone-500 flex-grow leading-relaxed">
          {description}
        </p>

        {/* Arrow link */}
        <div className="mt-5 flex items-center gap-2 text-orange-500/70 text-sm font-medium group-hover:text-orange-600 transition-all duration-300">
          <span>Try now</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
