import { MovieI } from "./movie";
import { SubsidiaryI } from "./subsidiary";

export interface ShowI {
  dateAndTime: Date;
  movie: MovieI;
  showType: string;
  selectedLanguage: string;
  room: string;
  subsidiary: SubsidiaryI;
  tickets: string;
}