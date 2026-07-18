import { useState, useMemo } from 'react';
import { useListLanguages } from '@workspace/api-client-react';
import { LanguageCard } from '@/components/language-card';
import { Navbar } from '@/components/navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

export default function Languages() {
  const { data: languages, isLoading } = useListLanguages();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParadigm, setSelectedParadigm] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allParadigms = useMemo(() => {
    if (!languages) return [];
    const paradigms = new Set<string>();
    languages.forEach(lang => lang.paradigms.forEach(p => paradigms.add(p)));
    return Array.from(paradigms).sort();
  }, [languages]);

  const allTags = useMemo(() => {
    if (!languages) return [];
    const tags = new Set<string>();
    languages.forEach(lang => lang.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [languages]);

  const filteredLanguages = useMemo(() => {
    if (!languages) return [];
    
    return languages.filter(lang => {
      const matchesSearch = !searchQuery.trim() || 
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesParadigm = !selectedParadigm || lang.paradigms.includes(selectedParadigm);
      const matchesTag = !selectedTag || lang.tags.includes(selectedTag);
      
      return matchesSearch && matchesParadigm && matchesTag;
    });
  }, [languages, searchQuery, selectedParadigm, selectedTag]);

  const activeFiltersCount = [selectedParadigm, selectedTag].filter(Boolean).length;

  return (
    <div className="min-h-[100dvh] bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Languages</h1>
          <p className="text-muted-foreground">
            Browse and filter {languages?.length || 0} programming languages
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-20">
              <div className="bg-card border border-card-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-sm">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter by name..."
                      className="pl-8 h-9 text-sm font-mono"
                      data-testid="input-filter-search"
                    />
                  </div>
                </div>

                {/* Paradigms */}
                <div className="mb-6">
                  <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">
                    Paradigms
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {allParadigms.map((paradigm) => (
                      <Badge
                        key={paradigm}
                        variant={selectedParadigm === paradigm ? "default" : "outline"}
                        className="cursor-pointer text-xs hover-elevate"
                        onClick={() => setSelectedParadigm(selectedParadigm === paradigm ? null : paradigm)}
                        data-testid={`badge-filter-paradigm-${paradigm}`}
                      >
                        {paradigm}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        className="cursor-pointer text-xs hover-elevate"
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        data-testid={`badge-filter-tag-${tag}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      setSelectedParadigm(null);
                      setSelectedTag(null);
                    }}
                    className="mt-4 text-xs text-primary hover:text-accent transition-colors w-full text-center"
                    data-testid="button-clear-filters"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-mono">
                {isLoading ? 'Loading...' : `${filteredLanguages.length} languages`}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-lg" />
                ))}
              </div>
            ) : filteredLanguages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredLanguages.map((lang) => (
                  <LanguageCard key={lang.slug} language={lang} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-border rounded-lg bg-card/30">
                <p className="text-muted-foreground mb-1">No languages match your filters.</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
