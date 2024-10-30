export class UpdateMovieDto {
  name?: string;
  poster?: string; // URL o base64 del póster
  description?: string;
  duration?: string;
  languageIds?: number[]; // Array de IDs de idiomas
  genreId?: number; // ID del género
  contentRatingId?: number; // ID de la calificación de contenido
}
