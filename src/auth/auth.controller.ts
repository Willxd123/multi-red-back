import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LogingDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(
    @Body()
    registerDto: RegisterDto,
  ) {
    //obtiene datos desde la api, si es igual al formato del regiterDto permite capturar errores
    return this.authService.register(registerDto); 
  }
  @Post('login')
  login(
    @Body()
    loginDto: LogingDto,
  ) {
    return this.authService.login(loginDto);
  }
}
