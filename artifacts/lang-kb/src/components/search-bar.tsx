import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  initialValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({ 
  placeholder = "Search programming languages...", 
  autoFocus = false,
  initialValue = "",
  onSearch,
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [, setLocation] = useLocation();

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="pl-10 pr-20 h-11 bg-card border-input font-mono text-sm"
          data-testid="input-search"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0"
              data-testid="button-clear-search"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            className="h-8 px-3 font-medium"
            data-testid="button-submit-search"
          >
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}
