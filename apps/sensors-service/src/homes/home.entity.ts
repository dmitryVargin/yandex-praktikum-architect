import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Room } from '../rooms/room.entity';

@Entity({ name: 'homes' })
export class Home {
  @PrimaryGeneratedColumn('uuid')
  uid!: string;

  // @Column({ type: 'uuid', name: 'user_id' })
  // userId!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  location!: string;

  @OneToMany(() => Room, (room) => room.home)
  rooms!: Room[];
}
