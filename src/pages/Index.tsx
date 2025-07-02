import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { MovieRow } from '@/components/MovieRow';
import { TrailerModal } from '@/components/TrailerModal';
import { tmdbService, Movie } from '@/services/tmdb';

const Index = () => {
  // Estado dos filmes
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  
  // Estado da aplicação
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [trailerMovieId, setTrailerMovieId] = useState<number | null>(null);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  
  // Estado de autenticação (será integrado com MySQL depois)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [myListMovieIds, setMyListMovieIds] = useState<number[]>([]);

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [popular, nowPlaying, topRated, tvShows] = await Promise.all([
          tmdbService.getPopularMovies(),
          tmdbService.getNowPlayingMovies(),
          tmdbService.getTopRatedMovies(),
          tmdbService.getPopularTVShows()
        ]);

        setPopularMovies(popular);
        setNowPlayingMovies(nowPlaying);
        setTopRatedMovies(topRated);
        setPopularTVShows(tvShows);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Buscar filmes
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = await tmdbService.searchMovies(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Erro na busca:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Abrir trailer
  const handlePlayTrailer = (movieId: number) => {
    setTrailerMovieId(movieId);
    setIsTrailerModalOpen(true);
  };

  // Fechar trailer
  const handleCloseTrailer = () => {
    setIsTrailerModalOpen(false);
    setTrailerMovieId(null);
  };

  // Simular login (será substituído por MySQL)
  const handleLogin = () => {
    setIsAuthenticated(true);
    // Aqui será implementada a lógica de login real
    console.log('Login - será implementado com MySQL');
  };

  // Simular logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setMyListMovieIds([]);
    console.log('Logout realizado');
  };

  // Simular perfil
  const handleProfile = () => {
    // Aqui será implementada a edição de perfil
    console.log('Perfil - será implementado com MySQL');
  };

  // Adicionar à minha lista
  const handleAddToList = (movie: Movie) => {
    if (!isAuthenticated) return;
    
    if (!myListMovieIds.includes(movie.id)) {
      setMyListMovieIds(prev => [...prev, movie.id]);
      // Aqui será implementada a persistência no MySQL
      console.log('Filme adicionado à lista:', movie.title);
    }
  };

  // Remover da minha lista
  const handleRemoveFromList = (movieId: number) => {
    if (!isAuthenticated) return;
    
    setMyListMovieIds(prev => prev.filter(id => id !== movieId));
    // Aqui será implementada a remoção no MySQL
    console.log('Filme removido da lista:', movieId);
  };

  // Filmes da minha lista
  const myListMovies = popularMovies.concat(nowPlayingMovies, topRatedMovies, popularTVShows)
    .filter(movie => myListMovieIds.includes(movie.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        onSearch={handleSearch}
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        {!searchQuery && (
          <Hero 
            onWatchTrailer={handlePlayTrailer}
            onAddToList={handleAddToList}
            isAuthenticated={isAuthenticated}
          />
        )}

        {/* Content Sections */}
        <div className="space-y-8 pb-8">
          {/* Search Results */}
          {searchQuery && searchResults.length > 0 && (
            <MovieRow
              title={`Resultados para "${searchQuery}"`}
              movies={searchResults}
              onPlay={handlePlayTrailer}
              onAddToList={handleAddToList}
              onRemoveFromList={handleRemoveFromList}
              myListMovieIds={myListMovieIds}
              isAuthenticated={isAuthenticated}
            />
          )}

          {/* Minha Lista */}
          {isAuthenticated && myListMovies.length > 0 && (
            <MovieRow
              title="Minha Lista"
              movies={myListMovies}
              onPlay={handlePlayTrailer}
              onAddToList={handleAddToList}
              onRemoveFromList={handleRemoveFromList}
              myListMovieIds={myListMovieIds}
              isAuthenticated={isAuthenticated}
            />
          )}

          {/* Movie Sections */}
          {!searchQuery && (
            <>
              <MovieRow
                title="Populares"
                movies={popularMovies}
                onPlay={handlePlayTrailer}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
                myListMovieIds={myListMovieIds}
                isAuthenticated={isAuthenticated}
                loading={loading}
              />

              <MovieRow
                title="Em Cartaz"
                movies={nowPlayingMovies}
                onPlay={handlePlayTrailer}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
                myListMovieIds={myListMovieIds}
                isAuthenticated={isAuthenticated}
                loading={loading}
              />

              <MovieRow
                title="Mais Bem Avaliados"
                movies={topRatedMovies}
                onPlay={handlePlayTrailer}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
                myListMovieIds={myListMovieIds}
                isAuthenticated={isAuthenticated}
                loading={loading}
              />

              <MovieRow
                title="Séries Populares"
                movies={popularTVShows}
                onPlay={handlePlayTrailer}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
                myListMovieIds={myListMovieIds}
                isAuthenticated={isAuthenticated}
                loading={loading}
              />
            </>
          )}

          {/* Empty States */}
          {searchQuery && searchResults.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                Nenhum resultado encontrado para "{searchQuery}"
              </p>
            </div>
          )}

          {isAuthenticated && myListMovies.length === 0 && !searchQuery && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                Sua lista está vazia. Adicione filmes clicando no ícone + nos filmes.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Trailer Modal */}
      <TrailerModal
        movieId={trailerMovieId}
        isOpen={isTrailerModalOpen}
        onClose={handleCloseTrailer}
      />
    </div>
  );
};

export default Index;