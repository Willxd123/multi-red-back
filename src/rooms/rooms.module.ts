import { forwardRef, Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomUser } from 'src/room-user/entities/room-user.entity';
import { UsersModule } from 'src/users/users.module';
import { RoomsGateway } from './rooms.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { RoomUserModule } from 'src/room-user/room-user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RoomUser]),
    forwardRef(() => UsersModule),  // Si hay una dependencia circular con UsersModule
    forwardRef(() => AuthModule),   // Si hay una dependencia circular con AuthModule
    RoomUserModule, // Importa RoomUserModule
  ],
  providers: [RoomsService, RoomsGateway],
  controllers: [RoomsController],
  exports: [RoomsService, RoomsGateway], // Exportar RoomsGateway para que otros módulos lo usen
})
export class RoomsModule {}
