import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from 'src/common/enums/rol.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';


@Roles(Role.USER)
@UseGuards(AuthGuard, RolesGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Auth(Role.USER) // Aseguramos que solo usuarios autenticados puedan crear salas
  create(
    @Body() createRoomDto: CreateRoomDto,
    @ActiveUser() user: UserActiveInterface, // Obtenemos el usuario autenticado
  ) {
    return this.roomsService.create(createRoomDto, user);
  }
 /*  @Get('user-rooms')
  @Auth(Role.USER) // Asegura que el usuario esté autenticado
  getUserRooms(@ActiveUser() user: UserActiveInterface) {
    return this.roomsService.getUserRooms(user);
  } */
  @Get(':code') // Cambiamos para que busque una sala por su código
  findOne(@Param('code') code: string) {
    return this.roomsService.findByCode(code);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
