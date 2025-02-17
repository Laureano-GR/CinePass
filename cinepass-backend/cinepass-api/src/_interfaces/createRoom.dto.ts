export interface CreateRoomDto {
  roomNumber: number;
  capacity: number;
  subsidiaryId: number; // Solo el ID de la sucursal, no el objeto entero
  showTypeIds: number[]; // Solo los IDs de los tipos de show
}