import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FriendShip } from "./FriendShip";
import User from "./User";
@Entity()
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  // @ManyToOne(() => User, (user) => user.friends)
  id: string;
  @Column({ unique: true })
  username: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: "CASCADE" })
  user: User;

  @OneToMany(() => FriendShip, (friendShip) => friendShip.friend)
  friendShips: FriendShip[];
}