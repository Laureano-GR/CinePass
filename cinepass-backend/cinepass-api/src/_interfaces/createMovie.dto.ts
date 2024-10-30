export class CreateMovieDto {
  name: string;
  poster: string; // URL
  description: string;
  duration: string;
  languageIds: number[];
  genreId: number;
  contentRatingId: number;
}
