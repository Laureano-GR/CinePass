export interface CreateMovieDto {
  name: string;
  poster: string;
  description: string;
  duration: string;
  languageIds: number[];
  showTypeIds: number[];
  genreId: number;
  contentRatingId: number;
}