import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Avatar from "./Avatar";
import ChatRoom from "./ChatRoom";
import { FriendShip } from "./FriendShip";
import User from "./User";
import UserRoomJoinTable from "./UserRoomJoinTable";
@Entity()
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  showname: string;

  @OneToOne(() => Avatar, (avatar) => avatar.profile, { onDelete: "CASCADE" })
  @JoinColumn()
  avatar: Avatar;

  @OneToOne(() => User, (user) => user.profile, { onDelete: "CASCADE" })
  user: User;

  @OneToMany(() => FriendShip, (friendShip) => friendShip.user)
  friendShips: FriendShip[];

  @ManyToMany(() => ChatRoom, (chatroom) => chatroom.members)
  chatRooms: ChatRoom[];

  @ManyToOne(() => UserRoomJoinTable, (joinTable) => joinTable.profile)
  joinTable: UserRoomJoinTable;
}
