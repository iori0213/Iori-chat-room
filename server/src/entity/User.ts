import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, } from "typeorm";
import ChatRoom from "../entity/ChatRoom";
import { FriendList } from "./FriendList";

@Entity()
export default class User {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  name: string;

  @Column()
  password: string;

  @Column({ type: "simple-array", nullable: true })
  refreshToken: string[];

  @ManyToMany(() => ChatRoom, (room) => room.members)
  chatRooms: ChatRoom[]

  @OneToMany(() => FriendList, (list) => list.friend)
  friends: FriendList[]
}
