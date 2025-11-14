import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Not, IsNull } from 'typeorm'; // Importar Not e IsNull

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Permite la creación con campos opcionales como facebookId y email: null
  create(createUserDto: CreateUserDto & { facebookId?: string, email?: string | null }) {
    return this.userRepository.save(createUserDto);
  }
  
  // ⬅️ NUEVO: Busca un usuario por su ID de Facebook
  findOneByFacebookId(facebookId: string) {
    return this.userRepository.findOneBy({ facebookId });
  }

  //retorna si existe o no el usuario en la bd (usa email)
  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
  
  //retorna los datos del usuario menos la contraseña luego de loguearse (usa email)
  findByEmailWithPassword(email: string) {
    // Esto se usa para el login local. Funciona porque el email es único.
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'],
    });
  }

  // ⬅️ NUEVO: Actualiza el ID de Facebook de un usuario existente
  async updateFacebookId(id: number, facebookId: string): Promise<void> {
    await this.userRepository.update(id, { facebookId });
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role'],
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}