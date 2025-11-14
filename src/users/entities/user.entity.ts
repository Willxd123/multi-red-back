import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from 'src/common/enums/rol.enum';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // 🚨 CAMBIO CLAVE 1: Permitimos NULL para usuarios de SSO sin email
  @Column({ unique: true, nullable: true })
  email: string | null; 

  // 🚨 CAMBIO CLAVE 2: Añadimos facebookId como identificador único de SSO
  @Column({ unique: true, nullable: true })
  facebookId: string | null; 

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ type: 'enum', default: Role.USER, enum: Role })
  role: Role;

  @DeleteDateColumn()
  deletedAt: Date;
}