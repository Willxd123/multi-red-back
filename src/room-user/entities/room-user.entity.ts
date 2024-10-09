import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Room_rol } from 'src/common/enums/room-rol.enum';

@Entity()
export class RoomUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.rooms)
  user: User;

  @ManyToOne(() => Room, room => room.participants)
  room: Room;

  @Column({ type: 'enum', enum: Room_rol })
  role: Room_rol;


}
