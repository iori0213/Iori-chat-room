import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import ChatsEntity from "./ChatsEntity";
import UserEntity from "./UserEntity"

@Entity({ name: "ChatRoom" })
export default class ChatRoomEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany(() => ChatsEntity, (chats) => chats.chatroomID)
  @JoinColumn({ name: "chatroomID" })
  chatRoom: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.id, { nullable: false })
  @JoinColumn({ name: "user_id" })
  userID: UserEntity;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.id, { nullable: false })
  @JoinColumn({ name: "friend_id" })
  friendID: UserEntity;

  @Column({ nullable: true })
  lastMsg: string;

  @Column()
  seen: string;

  @Column()
  unseenNumber: string;

}