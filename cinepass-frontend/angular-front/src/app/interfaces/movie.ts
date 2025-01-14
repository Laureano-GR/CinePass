import { GenreI } from "./genre";
import { ShowI } from "./show";

export interface MovieI {
  id: number;
  name: string;
  poster: string; 
  description: string;
  duration: string; // duracion en minutos
  languages: string;
  contentRating: string;
  genre: GenreI;
  shows: ShowI[];
}