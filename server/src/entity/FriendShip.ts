import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./Profile";

@Entity()
export class FriendShip {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profile, {
    onDelete: "CASCADE"
  })
  user: Profile;

  @ManyToOne(() => Profile, (profile) => profile.friendShips)
  friend: Profile;

}
