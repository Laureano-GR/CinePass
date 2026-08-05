export interface CreateMovieDto {
  name: string;
  poster: string; // Ruta del archivo
  description: string;
  duration: string;
  languageIds: number[];
  showTypeIds: number[];
  genreId: number;
  contentRatingId: number;
}
