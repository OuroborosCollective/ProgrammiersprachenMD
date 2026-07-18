import { Link, useLocation } from 'wouter';
import { Code2, Home, List } from 'lucide-react';

export function Navbar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <Code2 className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
              <span className="font-semibold text-sm tracking-tight">
                Lang<span className="text-primary">KB</span>
              </span>
            </Link>

            <div className="flex items-center gap-1">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive('/')
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                data-testid="link-home"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/languages"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive('/languages')
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                data-testid="link-languages"
              >
                <List className="w-4 h-4" />
                All Languages
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono hidden sm:block">
              Developer Reference
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
