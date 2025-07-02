import { useState, useEffect } from 'react';
import { Play, Plus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { tmdbService, Movie } from '@/services/tmdb';

interface HeroProps {
  onWatchTrailer?: (movieId: number) => void;
  onAddToList?: (movie: Movie) => void;
  isAuthenticated?: boolean;
}

export function Hero({ onWatchTrailer, onAddToList, isAuthenticated = false }: HeroProps) {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedMovie = async () => {
      try {
        const movie = await tmdbService.getFeaturedMovie();
        setFeaturedMovie(movie);
      } catch (error) {
        console.error('Erro ao carregar filme em destaque:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedMovie();
  }, []);

  if (loading) {
    return (
      <div className="relative h-screen bg-muted animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>
    );
  }

  if (!featuredMovie) {
    return null;
  }

  const handleWatchTrailer = () => {
    if (onWatchTrailer) {
      onWatchTrailer(featuredMovie.id);
    }
  };

  const handleAddToList = () => {
    if (onAddToList && isAuthenticated) {
      onAddToList(featuredMovie);
    }
  };

  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${tmdbService.getBackdropURL(featuredMovie.backdrop_path)})`
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4">
              {featuredMovie.title}
            </h1>
            
            <p className="text-lg md:text-xl text-text-secondary mb-8 line-clamp-3">
              {featuredMovie.overview}
            </p>

            <div className="flex items-center space-x-4">
              <Button
                size="lg"
                onClick={handleWatchTrailer}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                <Play className="h-5 w-5 mr-2 fill-current" />
                Assistir Trailer
              </Button>

              {isAuthenticated && (
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleAddToList}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Minha Lista
                </Button>
              )}

              <Button
                size="lg"
                variant="ghost"
                className="text-foreground border-foreground hover:bg-foreground/10"
              >
                <Info className="h-5 w-5 mr-2" />
                Mais Informações
              </Button>
            </div>

            {/* Movie Info */}
            <div className="flex items-center space-x-4 mt-8 text-sm text-text-secondary">
              <span className="px-2 py-1 bg-secondary rounded text-secondary-foreground">
                ⭐ {featuredMovie.vote_average.toFixed(1)}
              </span>
              <span>{new Date(featuredMovie.release_date).getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}