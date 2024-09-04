import { Column, DeleteDateColumn, Entity } from "typeorm";

@Entity()
export class User {
    @Column({ primary: true, generated: true})
    id: number;

    @Column()
    name: string;
    //campo unico para que no se repitan los correos
    @Column({unique: true,nullable: false})
    email: string;
    //campo obligatorio
    @Column({nullable: false})
    password: string;
    
    @Column({default: 'user'})
    rol: string;
//permite eliminarse al usuario pero se amntiene sus datos 
    @DeleteDateColumn()
    deletedAt: Date;
}
