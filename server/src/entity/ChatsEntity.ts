import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import ChatRoomEntity from "./ChatRoomEntity";
import UserEntity from "./UserEntity";

@Entity({ name: "Chats" })
export default class ChatsEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany(() => ChatRoomEntity, (Chatroom) => Chatroom.chatRoom)
  @JoinColumn({ name: "chatroom" })
  chatroomID: ChatRoomEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: "sender_id" })
  senderID: string;

  @Column({ nullable: false })
  msg: string;

  @CreateDateColumn()
  created: string;
}