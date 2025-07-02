import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { tmdbService, Video } from '@/services/tmdb';

interface TrailerModalProps {
  movieId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TrailerModal({ movieId, isOpen, onClose }: TrailerModalProps) {
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && movieId) {
      loadTrailer();
    } else {
      setTrailer(null);
    }
  }, [isOpen, movieId]);

  const loadTrailer = async () => {
    if (!movieId) return;
    
    setLoading(true);
    try {
      const trailerData = await tmdbService.getMovieTrailer(movieId);
      setTrailer(trailerData);
      
      if (!trailerData) {
        alert('Trailer não disponível para este filme.');
        onClose();
      }
    } catch (error) {
      console.error('Erro ao carregar trailer:', error);
      alert('Erro ao carregar trailer. Tente novamente.');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl mx-4 bg-background rounded-lg overflow-hidden">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Content */}
        <div className="aspect-video">
          {loading ? (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando trailer...</p>
              </div>
            </div>
          ) : trailer ? (
            <iframe
              src={tmdbService.getYouTubeURL(trailer.key)}
              title={trailer.name}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Trailer não disponível</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}