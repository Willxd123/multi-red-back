import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RoomUserService } from './room-user.service';
import { CreateRoomUserDto } from './dto/create-room-user.dto';

@Controller('room-user')
export class RoomUserController {
  constructor(private readonly roomUserService: RoomUserService) {}

  // Endpoint para agregar un usuario a una sala
  @Post()
  addUserToRoom(@Body() createRoomUserDto: CreateRoomUserDto) {
    return this.roomUserService.addUserToRoom(createRoomUserDto);
  }

  // Endpoint para listar todos los usuarios en una sala
  @Get(':roomId')
  findUsersInRoom(@Param('roomId') roomId: number) {
    return this.roomUserService.findUsersInRoom(roomId);
  }
}
