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
import { CreateUserDto } from 'src/users/dto/create-user.dto';

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
    const payload = { id: user.id, email: user.email, role: user.role };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email,
    };
  }

  //prueba para ruta con rol autorizado

  async profile({ email, role }: { email: string; role: string }) {
    return await this.usersService.findOneByEmail(email);
  }

  //google
  async googleLogin(user: any) {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Verificar si el usuario ya existe en la base de datos por email
    let existingUser = await this.usersService.findOneByEmail(user.email);

    if (!existingUser) {
      // Si no existe, creamos un nuevo usuario en la BD
      existingUser = await this.usersService.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        password: null, // No se usa password para usuarios de Google, pero lo dejamos vacío
      });
    }

    // Generar JWT basado en el usuario de la BD
    const payload = {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
        email: existingUser.email,
        name: existingUser.name,
        picture: user.picture, // Foto de perfil de Google
    };
  }
  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(googleUser.email);
    if (user) return user;
    return await this.usersService.create(googleUser);
  }
  
}
