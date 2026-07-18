import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { useSearchLanguages, getSearchLanguagesQueryKey } from '@workspace/api-client-react';
import { SearchBar } from '@/components/search-bar';
import { LanguageCard } from '@/components/language-card';
import { Navbar } from '@/components/navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const [location, setLocation] = useLocation();
  
  const searchParams = useMemo(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    return params.get('q') || '';
  }, [location]);

  const { data: results, isLoading } = useSearchLanguages(
    { q: searchParams },
    { query: { enabled: !!searchParams, queryKey: getSearchLanguagesQueryKey({ q: searchParams }) } }
  );

  const handleSearch = (query: string) => {
    setLocation(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-[100dvh] bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <SearchIcon className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">Search Results</h1>
          </div>
          <SearchBar
            placeholder="Search programming languages..."
            autoFocus={!searchParams}
            initialValue={searchParams}
            onSearch={handleSearch}
            className="max-w-2xl"
          />
        </div>

        {!searchParams ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg bg-card/30">
            <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-1">Enter a search query to find languages</p>
            <p className="text-sm text-muted-foreground">
              Search by name, description, paradigms, or tags
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground font-mono">
                {isLoading ? 'Searching...' : `${results?.length || 0} results for "${searchParams}"`}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-lg" />
                ))}
              </div>
            ) : results && results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((lang) => (
                  <LanguageCard key={lang.slug} language={lang} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-border rounded-lg bg-card/30">
                <p className="text-muted-foreground mb-1">No languages found for "{searchParams}"</p>
                <p className="text-sm text-muted-foreground">
                  Try different keywords or browse all languages
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
