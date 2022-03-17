import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import ChatRoomEntity from "./ChatRoomEntity";

@Entity({ name: "User" })
export default class UserEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: "simple-array", nullable: true })
  refreshToken: string[];

  @Column({ type: "simple-array", nullable: true })
  friendList: string[];


  @OneToMany(() => ChatRoomEntity, (chatroom: ChatRoomEntity) => chatroom.userID, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  }) user: Array<ChatRoomEntity>
  @OneToMany(() => ChatRoomEntity, (chatroom: ChatRoomEntity) => chatroom.friendID, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  }) friend: Array<ChatRoomEntity>

}
