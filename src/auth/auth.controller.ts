import { AuthGuard } from './guard/auth.guard';
import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LogingDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import { Role } from 'src/common/enum/rol.enum';

interface RequestWithUser extends Request {
  user: {
    email: string;
    role: string;
  };
}
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

  //vista a perfil
  @Get('perfil')
  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  perfil(@Req() req: RequestWithUser) {
    return this.authService.perfil(req.user);
  }
}
