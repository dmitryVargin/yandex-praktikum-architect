import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Home } from '../homes/home.entity';

@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn('uuid')
  uid!: string;

  @Column({ type: 'uuid', name: 'home_id' })
  homeId!: string;

  @ManyToOne(() => Home, (home) => home.rooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'home_id', referencedColumnName: 'uid' })
  home!: Home;

  @Column({ type: 'varchar', length: 255 })
  name!: string;
}
