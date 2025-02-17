import { ShowTypeI } from "./showType";
import { SubsidiaryI } from "./subsidiary";

export interface RoomI{
  roomNumber: number;
  capacity: number;
  subsidiary: SubsidiaryI;
  showTypes: ShowTypeI;
}