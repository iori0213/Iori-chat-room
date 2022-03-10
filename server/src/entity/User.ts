import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export default class User {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: "simple-array", nullable: true })
  refreshToken: string[];

}
