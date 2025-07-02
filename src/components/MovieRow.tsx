import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCard } from './MovieCard';
import { Movie } from '@/services/tmdb';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onPlay?: (movieId: number) => void;
  onAddToList?: (movie: Movie) => void;
  onRemoveFromList?: (movieId: number) => void;
  myListMovieIds?: number[];
  isAuthenticated?: boolean;
  loading?: boolean;
}

export function MovieRow({ 
  title, 
  movies, 
  onPlay, 
  onAddToList, 
  onRemoveFromList,
  myListMovieIds = [],
  isAuthenticated = false,
  loading = false 
}: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    updateScrollButtons();
    const handleResize = () => updateScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [movies]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 400;
    const newScrollLeft = scrollRef.current.scrollLeft + 
      (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-muted rounded w-48 animate-pulse" />
        <div className="flex space-x-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="min-w-[200px] h-[300px] bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Section Title */}
      <h2 className="text-xl md:text-2xl font-bold text-foreground px-4">
        {title}
      </h2>

      {/* Movies Container */}
      <div className="relative group">
        {/* Left Arrow */}
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {/* Movies Scroll Container */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 pb-4"
          onScroll={updateScrollButtons}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlay={onPlay}
              onAddToList={onAddToList}
              onRemoveFromList={onRemoveFromList}
              isInMyList={myListMovieIds.includes(movie.id)}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}