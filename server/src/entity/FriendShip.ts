import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./Profile";

@Entity()
export class FriendShip {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profile, (profile) => profile.friendShips, {
    onDelete: "CASCADE"
  })
  user: Profile;

  @ManyToOne(() => Profile, { onDelete: "CASCADE" })
  friend: Profile;

}
