import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import ChatRoom from "../entity/ChatRoom";
import User from "./User";

@Entity()
export default class Message {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  msg: string;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => ChatRoom, (room) => room.chats)
  room: ChatRoom;

  @CreateDateColumn()
  created: Date;
}

// const socket: any = undefined // ex

// const func = async () => {

// }

// interface Socket {
//   on: any
// }

// const biggerFuncion = async (socket: Socket, user: UserEntity, room: ChatRoom) => {

//   socket.on('new-msg', (msg: string) => {
//     const newMsg = new Chat()


//   })
// }