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
      className="group block rounded-2xl bg-surface border border-border p-5 hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-card"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold group-hover:text-primary transition-colors">{name}</h3>
            <p className="text-xs text-muted">{platforms.join(" · ")}</p>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
      </div>
      <p className="text-sm text-muted mb-3 line-clamp-2">{description}</p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-md bg-background border border-border text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
