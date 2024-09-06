import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomUser } from './entities/room-user.entity';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { CreateRoomUserDto } from './dto/create-room-user.dto';

@Injectable()
export class RoomUserService {
  constructor(
    @InjectRepository(RoomUser)
    private readonly roomUserRepository: Repository<RoomUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  // Método para agregar un usuario a una sala
  async addUserToRoom(createRoomUserDto: CreateRoomUserDto) {
    const { userId, roomId } = createRoomUserDto;

    // Buscar el usuario
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Buscar la sala
    const room = await this.roomRepository.findOneBy({ id: roomId });
    if (!room) {
      throw new Error('Room not found');
    }

    // Verificar si el usuario ya está en la sala
    const existingRoomUser = await this.roomUserRepository.findOne({ where: { user: { id: userId }, room: { id: roomId } } });
    if (existingRoomUser) {
      throw new Error('User is already in the room');
    }

    // Crear la relación en RoomUser
    const roomUser = this.roomUserRepository.create({ user, room });
    return this.roomUserRepository.save(roomUser);
  }

  // Método para listar todos los usuarios en una sala
  async findUsersInRoom(roomId: number) {
    return this.roomUserRepository.find({
      where: { room: { id: roomId } },
      relations: ['user'],
    });
  }
}
