import { AuthGuard } from './guard/auth.guard';
import { Controller, Post, Body, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LogingDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { Role } from 'src/common/enums/rol.enum';
import { GoogleAuthGuard } from './guard/google-auth.guard';

@ApiTags('auth')
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

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    // Inicia la autenticación con Google
  }

  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.login(req.user.id);
    /* res.redirect(`http://localhost:4200?token=${response.accessToken}`); */
  }

  //vista a perfil
  @ApiBearerAuth()
  @Get('profile')
  @Auth(Role.USER)
  profile(@ActiveUser() user: UserActiveInterface) {
    console.log(user);
    return this.authService.profile(user);
  }
}
