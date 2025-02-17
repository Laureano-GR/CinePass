import { ShowTypeI } from "./showType";
import { SubsidiaryI } from "./subsidiary";

export interface RoomI{
  id: number
  roomNumber: number;
  capacity: number;
  subsidiary: SubsidiaryI;
  showTypes: ShowTypeI;
}