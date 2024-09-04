import { BadGatewayException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LogingDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register({ name, email, password }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new BadGatewayException('User already exists');
    }
    return await this.usersService.create({ 
      name, 
      email, 
      password: await bcryptjs.hash(password, 10)//encriptado de contraseña
    });
    //rellena los campos del usuario asignado en el body luego ser validado por el controlador
  }

  async login({email, password}: LogingDto) {
    const user = await this.usersService.findOneByEmail(email);
    if(!user){
      throw new UnauthorizedException('email is wrong');
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if(!isPasswordValid){
      throw new UnauthorizedException('password is wrong');
    }
    return user;
  }
}
