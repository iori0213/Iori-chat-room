import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { FriendShip } from "./FriendShip";
import { Profile } from "./Profile";

@Entity()
export default class User {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "simple-array", nullable: true })
  refreshToken: string[];

  @OneToOne(() => Profile, (profile) => profile.user, { onDelete: "CASCADE" })
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => FriendShip, (friendlist) => friendlist)
  friendlist: FriendShip[];

  // @ManyToMany(() => ChatRoom, (room) => room.members)
  // chatRooms: ChatRoom[]

}
