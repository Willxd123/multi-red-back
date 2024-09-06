import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { RoomUser } from 'src/room-user/entities/room-user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: 'user' })
  role: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Room, room => room.creator)
  createdRooms: Room[];

  @OneToMany(() => RoomUser, roomUser => roomUser.user)
  rooms: RoomUser[]; // Salas a las que el usuario pertenece
}
