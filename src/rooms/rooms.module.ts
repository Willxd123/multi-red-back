import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomUser } from 'src/room-user/entities/room-user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomUser]), UsersModule,],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
