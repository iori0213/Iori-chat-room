import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import ChatRoom from "./ChatRoom";
import { Profile } from "./Profile";

@Entity()
export default class UserRoomJoinTable {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => Profile, (profile) => profile.joinTable)
  profile: Profile;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.joinTable)
  chatRoom: ChatRoom;

  @Column("boolean", { default: true })
  join: boolean;
}
