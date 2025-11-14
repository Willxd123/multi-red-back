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
  async googleLogin(user: any): Promise<{ token: string; user: any }> {
    let existingUser = await this.usersService.findOneByEmail(user.email);
  
    if (!existingUser) {
      existingUser = await this.usersService.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        password: null, // No almacenamos contraseña para usuarios de Google
      });
    }
  
    const token = await this.jwtService.signAsync({ id: existingUser.id, email: existingUser.email });
  
    return {
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    };
  }
  // Nuevo método para manejar el login de Facebook
  async facebookLogin(user: any): Promise<{ token: string; user: any }> {
    const { facebookId, name, facebookAccessToken } = user;
    
    // 1. Buscar usuario por ID de Facebook (PRIMARY KEY para SSO)
    let existingUser = await this.usersService.findOneByFacebookId(facebookId);
    
    // 2. Si no existe, crear el usuario con los datos de SSO
    if (!existingUser) {
      // Creamos un usuario de solo SSO. El email será NULL en la base de datos, 
      // lo cual mantiene la unicidad del login local.
      existingUser = await this.usersService.create({
        email: null, // ⬅️ NULL para que no choque con el error de Scopes
        name: name,
        password: null, 
        facebookId: facebookId, // Guardamos el ID de Facebook
      });
    }
    
    // 3. Generar el JWT de tu aplicación
    const payload = { 
      id: existingUser.id, 
      email: existingUser.email, 
      role: existingUser.role 
    };

    const token = await this.jwtService.signAsync(payload);
  
    return {
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        facebookAccessToken: facebookAccessToken, // Devolvemos el token para publicar
      },
    };
  }

}
