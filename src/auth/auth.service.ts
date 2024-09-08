import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LogingDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../common/enum/rol.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register({ name, email, password }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);
    //almacena el usuario reguistrado
    if (user) {
      throw new BadGatewayException('User already exists');
    }
    await this.usersService.create({
      name,
      email,
      password: await bcryptjs.hash(password, 10), //encriptado de contraseña
    });
    //rellena los campos del usuario asignado en el body luego ser validado por el controlador
    /* devuelve el nombre y correo */
    return {
      name,
      email,
    };
  }

  async login({ email, password }: LogingDto) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('email is wrong');
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password is wrong');
    }
    //no poner informacion confidencial del usuario
    const payload = { email: user.email, role: user.role };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email,
    };
  }

  //prueba para ruta con rol autorizado
  async perfil({ email, role }: { email: string; role: string }) {
    /* if (role !== Role.USER && Role.ADMIN) {
      throw new UnauthorizedException('usuario no autorizado');
    } */
    return await this.usersService.findOneByEmail(email);
  }
}
