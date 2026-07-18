import { useParams } from 'wouter';
import { useGetLanguage, getGetLanguageQueryKey, useCrawlLanguage } from '@workspace/api-client-react';
import { Navbar } from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Calendar, RefreshCw, Clock, Tag, Layers } from 'lucide-react';
import { Link } from 'wouter';
import ReactMarkdown from 'react-markdown';

export default function LanguageDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || '';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: language, isLoading } = useGetLanguage(slug, {
    query: { enabled: !!slug, queryKey: getGetLanguageQueryKey(slug) }
  });

  const crawlMutation = useCrawlLanguage();

  const handleCrawl = () => {
    if (!slug) return;

    crawlMutation.mutate(
      { slug },
      {
        onSuccess: (result) => {
          if (result.success) {
            toast({
              title: 'Crawl successful',
              description: result.message,
            });
            queryClient.invalidateQueries({ queryKey: getGetLanguageQueryKey(slug) });
          } else {
            toast({
              title: 'Crawl failed',
              description: result.message,
              variant: 'destructive',
            });
          }
        },
        onError: () => {
          toast({
            title: 'Crawl failed',
            description: 'An error occurred while crawling.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
      </div>
    );
  }

  if (!language) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-2">Language not found</h1>
            <p className="text-muted-foreground mb-6">The requested language does not exist.</p>
            <Link href="/languages">
              <Button variant="default">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Languages
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/languages">
          <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2" data-testid="text-language-name">
                {language.name}
              </h1>
              <p className="text-lg text-muted-foreground" data-testid="text-language-description">
                {language.description}
              </p>
            </div>
            <Button
              onClick={handleCrawl}
              disabled={crawlMutation.isPending}
              variant="default"
              className="flex-shrink-0"
              data-testid="button-crawl"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${crawlMutation.isPending ? 'animate-spin' : ''}`} />
              {crawlMutation.isPending ? 'Crawling...' : 'Update'}
            </Button>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-mono">
            {language.year && (
              <div className="flex items-center gap-1.5" data-testid="text-language-year">
                <Calendar className="w-4 h-4" />
                <span>{language.year}</span>
              </div>
            )}
            {language.lastCrawled && (
              <div className="flex items-center gap-1.5" data-testid="text-last-crawled">
                <Clock className="w-4 h-4" />
                <span>Updated {new Date(language.lastCrawled).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Paradigms & Tags */}
        <div className="mb-8 space-y-4">
          {language.paradigms.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Paradigms
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {language.paradigms.map((paradigm) => (
                  <Badge
                    key={paradigm}
                    variant="secondary"
                    className="text-sm"
                    data-testid={`badge-paradigm-${paradigm}`}
                  >
                    {paradigm}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {language.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Tags
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {language.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-sm"
                    data-testid={`badge-tag-${tag}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="bg-card border border-card-border rounded-lg p-6" data-testid="markdown-content">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold mb-4 text-foreground">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-semibold mb-3 mt-8 text-foreground">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-semibold mb-2 mt-6 text-foreground">{children}</h3>,
                h4: ({ children }) => <h4 className="text-lg font-semibold mb-2 mt-4 text-foreground">{children}</h4>,
                p: ({ children }) => <p className="mb-4 text-muted-foreground leading-relaxed">{children}</p>,
                code: ({ className, children }) => {
                  const isBlock = className?.includes('language-');
                  if (isBlock) {
                    return (
                      <code className="block bg-muted text-foreground px-4 py-3 rounded font-mono text-sm overflow-x-auto">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="bg-muted text-primary px-1.5 py-0.5 rounded font-mono text-sm">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto mb-4">{children}</pre>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-muted-foreground">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-muted-foreground">{children}</ol>,
                li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                a: ({ href, children }) => (
                  <a href={href} className="text-primary hover:text-accent transition-colors underline">
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
              }}
            >
              {language.content}
            </ReactMarkdown>
          </div>
        </div>
      </main>
    </div>
  );
}
