import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User";

@Entity()
export class FriendList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: string

  @ManyToOne(() => User, (user) => user.friends)
  friend: User[];

}