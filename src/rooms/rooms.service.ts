import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomUser } from 'src/room-user/entities/room-user.entity';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RoomUser)
    private readonly roomUserRepository: Repository<RoomUser>,
  ) {}

  // Renombrar el método a 'create' para que coincida con el controller
  async create(createRoomDto: CreateRoomDto) {
    const { userId, name } = createRoomDto;

    // Buscar el usuario que está creando la sala
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Crear el código único para la sala
    const code = this.generateUniqueCode();
    // Crear la sala
    const room = this.roomRepository.create({
      name,
      code,
      creator: user,  // Relacionar la sala con el creador
    });

    // Guardar la sala en la base de datos
    const newRoom = await this.roomRepository.save(room);

    // Agregar al creador como participante en la sala
    const roomUser = this.roomUserRepository.create({
      user,
      room: newRoom,
    });
    await this.roomUserRepository.save(roomUser);

    return newRoom;
  }

  // Implementar findAll
  async findAll() {
    return this.roomRepository.find();
  }

  // Implementar findOne
  async findOne(id: number) {
    return this.roomRepository.findOneBy({ id });
  }

  // Implementar update
  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomRepository.findOneBy({ id });
    if (!room) {
      throw new Error('Room not found');
    }
    room.name = updateRoomDto.name;
    return this.roomRepository.save(room);
  }

  // Implementar remove
  async remove(id: number) {
    const room = await this.roomRepository.findOneBy({ id });
    if (!room) {
      throw new Error('Room not found');
    }
    return this.roomRepository.remove(room);
  }
  //generador de las sala unica
  private generateUniqueCode(): string {
    return Math.random().toString(36).substr(2, 4).toUpperCase(); // Código único de sala
  }
}
