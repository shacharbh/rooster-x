import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {UserMetaData} from "./UserMetaData";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: "varchar", length: 255})
    public firstName: string;

    @Column({type: "varchar", length: 255})
    public lastName: string;

    @Column({type: "text"})
    public password: string;

    @Column({type: "boolean"})
    public isAdmin: boolean;

    @OneToMany(() => UserMetaData, x => x.user)
    public metaDatas: UserMetaData[];

}
