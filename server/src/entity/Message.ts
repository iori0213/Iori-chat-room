import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import ChatRoom from "../entity/ChatRoom";
import { Profile } from "./Profile";

@Entity()
export default class Message {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  msg: string;

  @ManyToOne(() => Profile)
  sender: Profile;

  @ManyToOne(() => ChatRoom, (room) => room.messages)
  room: ChatRoom;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;
}
