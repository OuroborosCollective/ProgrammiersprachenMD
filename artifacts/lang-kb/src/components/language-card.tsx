import { Link } from 'wouter';
import { Clock } from 'lucide-react';
import type { LanguageSummary } from '@workspace/api-client-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface LanguageCardProps {
  language: LanguageSummary;
}

export function LanguageCard({ language }: LanguageCardProps) {
  const displayParadigms = language.paradigms.slice(0, 3);
  const displayTags = language.tags.slice(0, 4);

  return (
    <Link href={`/languages/${language.slug}`}>
      <Card className="h-full p-4 hover-elevate transition-all duration-150 cursor-pointer border-card-border">
        <div className="flex flex-col gap-3 h-full">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-foreground truncate" data-testid={`text-lang-name-${language.slug}`}>
                {language.name}
              </h3>
              {language.year && (
                <p className="text-xs text-muted-foreground font-mono mt-0.5" data-testid={`text-year-${language.slug}`}>
                  {language.year}
                </p>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 flex-1" data-testid={`text-desc-${language.slug}`}>
            {language.description}
          </p>

          {displayParadigms.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {displayParadigms.map((paradigm) => (
                <Badge
                  key={paradigm}
                  variant="secondary"
                  className="text-xs font-medium"
                  data-testid={`badge-paradigm-${paradigm}`}
                >
                  {paradigm}
                </Badge>
              ))}
            </div>
          )}

          {displayTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {displayTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs"
                  data-testid={`badge-tag-${tag}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {language.lastCrawled && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono pt-1 border-t border-border/50">
              <Clock className="w-3 h-3" />
              <span data-testid={`text-last-crawled-${language.slug}`}>
                {new Date(language.lastCrawled).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
