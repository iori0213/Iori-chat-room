import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, } from "typeorm";
// import ChatRoom from "../entity/ChatRoom";
// import { FriendList } from "./FriendList";
import { Profile } from "./Profile";

@Entity()
export default class User {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "simple-array", nullable: true })
  refreshToken: string[];

  @OneToOne(() => Profile, (profile) => profile.user, { onDelete: "CASCADE" })
  @JoinColumn()
  profile: Profile;

  // @ManyToMany(() => ChatRoom, (room) => room.members)
  // chatRooms: ChatRoom[]

  // @OneToMany(() => FriendList, (list) => list.friend)
  // friends: FriendList[]
}
