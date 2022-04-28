import {
  Column,
  Entity,
  JoinTable,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  ManyToOne,
} from "typeorm";
import Message from "./Message";
import { Profile } from "./Profile";
import UserRoomJoinTable from "./UserRoomJoinTable";

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

  @OneToMany(() => UserRoomJoinTable, (joinTable) => joinTable.chatRoom)
  joinTable: UserRoomJoinTable;
}
