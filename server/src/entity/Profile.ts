import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FriendList } from "./FriendList";
import User from "./User";
@Entity()
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  @ManyToOne(() => FriendList, (list) => list.friends)
  id: string;

  @Column({ unique: true })
  username: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: "CASCADE" })
  user: User;

}