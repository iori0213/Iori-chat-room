import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { Profile } from "./Profile";

@Entity()
export default class Avatar {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("longblob", { nullable: true })
  profileImg: Buffer;

  @OneToOne(() => Profile, (profile) => profile.avatar)
  profile: Profile;
}
