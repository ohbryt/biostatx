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
    <Link href={href}>
      <div className="glass-card p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400">
            {icon}
          </div>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: `${tagColor}20`, color: tagColor }}
          >
            {tag}
          </span>
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-slate-400 flex-grow">{description}</p>
        <div className="mt-4 flex items-center gap-1 text-blue-400 text-sm font-medium">
          Try now
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
