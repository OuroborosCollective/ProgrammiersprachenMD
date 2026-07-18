import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Terminal, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Terminal className="w-20 h-20 text-muted-foreground" />
          </div>
          
          <div className="mb-8">
            <h1 className="text-6xl font-bold font-mono mb-4 text-primary">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              The page you're looking for doesn't exist in this knowledge base.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="default" data-testid="button-home">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Link href="/languages">
              <Button variant="outline" data-testid="button-languages">
                Browse Languages
              </Button>
            </Link>
          </div>

          <div className="mt-12 p-6 bg-card border border-card-border rounded-lg max-w-2xl mx-auto text-left">
            <p className="text-sm font-mono text-muted-foreground mb-2">
              $ cat error.log
            </p>
            <p className="text-sm font-mono text-foreground">
              Error: ENOENT - requested resource not found
            </p>
            <p className="text-sm font-mono text-muted-foreground mt-1">
              Try navigating to an existing page or use the search.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
