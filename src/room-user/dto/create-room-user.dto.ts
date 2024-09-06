import { IsInt } from 'class-validator';

export class CreateRoomUserDto {
  @IsInt()
  userId: number;

  @IsInt()
  roomId: number;
}
