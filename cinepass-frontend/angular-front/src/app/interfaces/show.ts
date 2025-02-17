import { LanguageI } from "./language";
import { MovieI } from "./movie";
import { RoomI } from "./room";
import { ShowTypeI } from "./showType";
import { SubsidiaryI } from "./subsidiary";

export interface ShowI {
  id: number;
  dateAndTime: Date;
  movie: MovieI;
  showType: ShowTypeI;
  selectedLanguage: LanguageI;
  room: RoomI;
  subsidiary: SubsidiaryI;
  tickets: Object[];
}