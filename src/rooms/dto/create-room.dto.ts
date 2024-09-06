import { IsString, IsInt } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;  // Nombre de la sala

  @IsInt()
  userId: number;  // ID del usuario que crea la sala
}
