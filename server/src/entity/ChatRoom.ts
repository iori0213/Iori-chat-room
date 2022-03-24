import { Column, Entity, JoinTable, PrimaryGeneratedColumn, ManyToMany, OneToMany } from "typeorm";
import Message from "./Message";
import { Profile } from "./Profile";

@Entity()
export default class ChatRoom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  roomname: string;

  @ManyToMany(() => Profile, (profile) => profile.chatRooms)
  @JoinTable()
  members: Profile[];

  @OneToMany(() => Message, (msg) => msg.room)
  messages: Message[];
}