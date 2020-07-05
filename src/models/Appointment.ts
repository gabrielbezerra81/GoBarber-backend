import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import User from "./User";

/**
 * Estipular um relacionamento
 *  Um para Um (OneToOne)
 *  Um para Muitos (OneToMany)
 *  Muitos para Muitos (ManyToMany) =>
 */

// KISS - Keep It Simple & Stupid

@Entity("appointments")
class Appointment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  provider_id: string;

  //Muitos Appointments para um usuário
  @ManyToOne(() => User)
  @JoinColumn({ name: "provider_id" })
  provider: User;

  @Column("time with time zone")
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Appointment;
