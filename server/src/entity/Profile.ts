import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import ChatRoom from "./ChatRoom";
import { FriendShip } from "./FriendShip";
import User from "./User";
@Entity()
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ unique: true })
  username: string;

  @Column()
  showname: string;

  @Column("longblob", { nullable: true })
  profileImg: Buffer;

  @OneToOne(() => User, (user) => user.profile, { onDelete: "CASCADE" })
  user: User;

  @OneToMany(() => FriendShip, (friendShip) => friendShip.user)
  friendShips: FriendShip[];

  @ManyToMany(() => ChatRoom, (chatroom) => chatroom.members)
  chatRooms: ChatRoom[];
}
