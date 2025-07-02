import { useState } from 'react';
import { Search, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onSearch?: (query: string) => void;
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  onProfile?: () => void;
}

export function Header({ onSearch, isAuthenticated = false, onLogin, onLogout, onProfile }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-primary">MovieFlow</h1>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Início</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Filmes</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Séries</a>
            {isAuthenticated && (
              <a href="#" className="text-foreground hover:text-primary transition-colors">Minha Lista</a>
            )}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Buscar filmes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-muted border border-border rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) setShowSearch(false);
                  }}
                />
              </form>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* User actions */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onProfile}
              >
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={onLogin}
            >
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}