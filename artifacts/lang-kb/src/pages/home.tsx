import { useState, useMemo } from 'react';
import { useListLanguages } from '@workspace/api-client-react';
import { SearchBar } from '@/components/search-bar';
import { LanguageCard } from '@/components/language-card';
import { Navbar } from '@/components/navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Terminal, TrendingUp, Clock } from 'lucide-react';

export default function Home() {
  const { data: languages, isLoading } = useListLanguages();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredLanguages = useMemo(() => {
    if (!languages) return [];
    // Featured: most popular/well-known languages
    const featured = ['python', 'javascript', 'typescript', 'rust', 'go', 'java'];
    return languages.filter(lang => featured.includes(lang.slug)).slice(0, 6);
  }, [languages]);

  const recentlyCrawled = useMemo(() => {
    if (!languages) return [];
    return [...languages]
      .filter(lang => lang.lastCrawled)
      .sort((a, b) => {
        const dateA = a.lastCrawled ? new Date(a.lastCrawled).getTime() : 0;
        const dateB = b.lastCrawled ? new Date(b.lastCrawled).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 6);
  }, [languages]);

  const filteredLanguages = useMemo(() => {
    if (!languages || !searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return languages.filter(lang =>
      lang.name.toLowerCase().includes(query) ||
      lang.slug.toLowerCase().includes(query) ||
      lang.description.toLowerCase().includes(query)
    );
  }, [languages, searchQuery]);

  const showResults = searchQuery.trim().length > 0;

  return (
    <div className="min-h-[100dvh] bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">
              Programming Language <span className="text-primary">Knowledge Base</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg mb-8 max-w-3xl">
            A comprehensive reference for programming languages. Search, explore, and learn about syntax, paradigms, and history.
          </p>
          
          <SearchBar 
            placeholder="Search languages, paradigms, features..."
            autoFocus={false}
            onSearch={setSearchQuery}
            className="max-w-2xl"
          />
        </div>

        {/* Search Results */}
        {showResults && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-semibold">Search Results</h2>
              <span className="text-sm text-muted-foreground font-mono">
                ({filteredLanguages.length} found)
              </span>
            </div>
            
            {filteredLanguages.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card/30">
                <p className="text-muted-foreground">No languages match your search.</p>
                <p className="text-sm text-muted-foreground mt-1">Try different keywords or browse all languages.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLanguages.map((lang) => (
                  <LanguageCard key={lang.slug} language={lang} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Featured Languages */}
        {!showResults && (
          <>
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-semibold">Featured Languages</h2>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-lg" />
                  ))}
                </div>
              ) : featuredLanguages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredLanguages.map((lang) => (
                    <LanguageCard key={lang.slug} language={lang} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card/30">
                  <p className="text-muted-foreground">No featured languages available yet.</p>
                </div>
              )}
            </section>

            {/* Recently Crawled */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-semibold">Recently Updated</h2>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-lg" />
                  ))}
                </div>
              ) : recentlyCrawled.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentlyCrawled.map((lang) => (
                    <LanguageCard key={lang.slug} language={lang} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card/30">
                  <p className="text-muted-foreground">No recently crawled languages.</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
