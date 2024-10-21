import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService,  private authService: AuthService,) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
      
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
): Promise<any> {
    console.log(profile);  // Para asegurarte de que los datos se reciben correctamente.

    const { emails, name } = profile;

    // Crear un objeto acorde al CreateUserDto, mapeando los datos relevantes.
    const userDto: CreateUserDto = {
        email: emails[0].value,
        name: `${name.givenName} ${name.familyName}`,  // Concatenar nombres.
        password: '',  // Dejar la contraseña vacía para usuarios autenticados por Google.
    };

    // Pasar el objeto mapeado a tu servicio de validación.
    const user = await this.authService.validateGoogleUser(userDto);

    if (!user) {
        return done(new Error('Error validando usuario de Google'), false);
    }

    // Finalizar con éxito.
    done(null, user);
    return user;
}

}
