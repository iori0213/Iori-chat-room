import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import ChatRoom from "./ChatRoom";
import { Profile } from "./Profile";

@Entity()
export default class UserRoomJoinTable {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @OneToMany(() => Profile, (profile) => profile.joinTable)
  profile: Profile;

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.joinTable)
  chatRoom: ChatRoom;

  @Column("boolean", { default: true })
  join: boolean;
}
