import { useState } from 'react';
import { Play, Plus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie, tmdbService } from '@/services/tmdb';

interface MovieCardProps {
  movie: Movie;
  onPlay?: (movieId: number) => void;
  onAddToList?: (movie: Movie) => void;
  onRemoveFromList?: (movieId: number) => void;
  isInMyList?: boolean;
  isAuthenticated?: boolean;
}

export function MovieCard({ 
  movie, 
  onPlay, 
  onAddToList, 
  onRemoveFromList, 
  isInMyList = false,
  isAuthenticated = false 
}: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handlePlay = () => {
    if (onPlay) {
      onPlay(movie.id);
    }
  };

  const handleListAction = () => {
    if (!isAuthenticated) return;
    
    if (isInMyList && onRemoveFromList) {
      onRemoveFromList(movie.id);
    } else if (!isInMyList && onAddToList) {
      onAddToList(movie);
    }
  };

  return (
    <div 
      className="group relative min-w-[200px] cursor-pointer transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster */}
      <div className="relative rounded-lg overflow-hidden bg-muted">
        <img
          src={tmdbService.getImageURL(movie.poster_path)}
          alt={movie.title}
          className={`w-full h-[300px] object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
            setImageLoaded(true);
          }}
        />
        
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handlePlay}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              <Play className="h-4 w-4 fill-current" />
            </Button>
            
            {isAuthenticated && (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleListAction}
                className={isInMyList ? 'bg-netflix-red hover:bg-netflix-red/90' : ''}
              >
                {isInMyList ? (
                  <Heart className="h-4 w-4 fill-current" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* My List Indicator */}
        {isInMyList && (
          <div className="absolute top-2 right-2 bg-netflix-red rounded-full p-1">
            <Heart className="h-3 w-3 text-white fill-current" />
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="mt-2 space-y-1">
        <h3 className="text-sm font-medium text-foreground line-clamp-1">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>{new Date(movie.release_date).getFullYear()}</span>
          <span className="flex items-center">
            ⭐ {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}