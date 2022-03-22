import {Column, Entity, JoinTable,  PrimaryGeneratedColumn, ManyToMany, OneToMany } from "typeorm";
import Message from "./Message";
import { Profile } from "./Profile";

@Entity()
export default class ChatRoom {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  roomname: string;

  @ManyToMany(()=>Profile)
	@JoinTable()
  members:Profile[];

  @OneToMany(()=>Message, (msg)=>msg.room)
  messages:Message[];
}

  
//   @OneToMany(()=>Message, (chat)=>chat.room)
//   chats:Message[]
// }
// // const func = async ( roomId: string) => {

// // const room = await getRepository(ChatRoom).findOne({
// //   where:{
// //     id: roomId
// //   },
// //   relations:['chats']
// // })
// // 	if (room){
// // 		return room.chats
// // 	}else {
// // 		return []
// // 	}

// // }


// // const getFunc =async (roomId: string) => {
// // 	const room = await getRepository(ChatRoom).createQueryBuilder('chat_room')
// // 		.where(
// // 			"chat_room.id = :id", {id: roomId}
// // 		)
// // 		.select(['chat_room.roomname','members.name'])
// // 		.leftJoin('chat_room.members', 'members')
// // 		.getOne()

// // 	const result: any = {
// // 		id: 'roomid',
// // 		roonname: 'some name',
// // 		members: [
// // 			{
// // 				id: 'user id',
// // 				name: '...',
// // 				email: '....'
// // 			},
// // 			{
// // 				id: 'user id',
// // 				name: '...',
// // 				email: '....'
// // 			}
// // 		]
// // 	}
// // }

// // const saveFunc = async (roonName: string, usernames: string[]) => {
// // 	const users = await getRepository(UserEntity).find({
// // 		where: {
// // 			name: In(usernames)
// // 		}
// // 	})

// // 	if (users.length === usernames.length){
// // 		const newRoom = new ChatRoom()
// // 		newRoom.roomname = roonName;
// // 		newRoom.members = users;

// // 		await getRepository(ChatRoom).save(newRoom)
// // 	}
	
// // }

// // const addFunc = async (roomId: string, newUsersToRoom: string[])=> {
// // 	const users = await getRepository(UserEntity).find({
// // 		where: {
// // 			name: In(newUsersToRoom)
// // 		}
// // 	})

// // 	if (users.length === newUsersToRoom.length){
// // 		const room = await getRepository(ChatRoom).findOne({
// // 			where: {
// // 				id: roomId
// // 			},
// // 			relations: ['members']
// // 		})

// // 		if (room){
// // 			room.members.push(...users)
// // 			await getRepository(ChatRoom).save(room)
// // 		}else {
// // 			// no roon error
// // 		}
	
// // 	}else {
// // 		// User not found error
// // 	}

// // }