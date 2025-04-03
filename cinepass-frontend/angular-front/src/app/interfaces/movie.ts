import { ContentRatingI } from "./contentRating";
import { GenreI } from "./genre";
import { ShowI } from "./show";
import { LanguageI } from "./language";
import { ShowTypeI } from "./showType";

export interface MovieI {
  id: number;
  name: string;
  poster: string; 
  description: string;
  duration: string; // duracion en minutos
  languages: LanguageI[];
  showTypes: ShowTypeI[];
  contentRating: ContentRatingI;
  genre: GenreI;
  shows: ShowI[];
}