import Link from "next/link";
import { ExternalLink, LucideIcon } from "lucide-react";

interface ClientCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  platforms: string[];
  href: string;
  tags?: string[];
}

export function ClientCard({
  name,
  description,
  icon: Icon,
  platforms,
  href,
  tags = [],
}: ClientCardProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-border bg-surface p-4 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 border border-border text-primary">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-[10px] text-muted">{platforms.join(" · ")}</p>
          </div>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-primary transition-colors" />
      </div>
      <p className="text-xs text-muted mb-2 line-clamp-2">{description}</p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 border border-border text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
