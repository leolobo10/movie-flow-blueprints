const API_KEY = '38c007f28d5b66f36b9c3cf8d8452a4b';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface Video {
  key: string;
  name: string;
  type: string;
  site: string;
}

class TMDBService {
  private async fetchFromTMDB(endpoint: string) {
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do TMDB');
    }
    return response.json();
  }

  // Buscar filmes em destaque
  async getFeaturedMovie(): Promise<Movie> {
    const data = await this.fetchFromTMDB('/movie/popular');
    return data.results[0];
  }

  // Buscar filmes populares
  async getPopularMovies(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/movie/popular');
    return data.results;
  }

  // Buscar filmes em cartaz
  async getNowPlayingMovies(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/movie/now_playing');
    return data.results;
  }

  // Buscar filmes mais bem avaliados
  async getTopRatedMovies(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/movie/top_rated');
    return data.results;
  }

  // Buscar séries populares
  async getPopularTVShows(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/tv/popular');
    return data.results.map((show: any) => ({
      ...show,
      title: show.name,
      release_date: show.first_air_date
    }));
  }

  // Buscar trailer de um filme
  async getMovieTrailer(movieId: number): Promise<Video | null> {
    try {
      const data = await this.fetchFromTMDB(`/movie/${movieId}/videos`);
      const trailer = data.results.find((video: Video) => 
        video.type === 'Trailer' && video.site === 'YouTube'
      );
      return trailer || null;
    } catch (error) {
      console.error('Erro ao buscar trailer:', error);
      return null;
    }
  }

  // Buscar filmes por categoria/gênero
  async getMoviesByGenre(genreId: number): Promise<Movie[]> {
    const data = await this.fetchFromTMDB(`/discover/movie&with_genres=${genreId}`);
    return data.results;
  }

  // Buscar filmes por termo
  async searchMovies(query: string): Promise<Movie[]> {
    if (!query.trim()) return [];
    const data = await this.fetchFromTMDB(`/search/movie&query=${encodeURIComponent(query)}`);
    return data.results;
  }

  // Utilitários para URLs de imagens
  getImageURL(path: string): string {
    return path ? `${IMAGE_BASE_URL}${path}` : '/placeholder.svg';
  }

  getBackdropURL(path: string): string {
    return path ? `${BACKDROP_BASE_URL}${path}` : '/placeholder.svg';
  }

  // Gerar URL do trailer do YouTube
  getYouTubeURL(key: string): string {
    return `https://www.youtube.com/embed/${key}`;
  }
}

export const tmdbService = new TMDBService();