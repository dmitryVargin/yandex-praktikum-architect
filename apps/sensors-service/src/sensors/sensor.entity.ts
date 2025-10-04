import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { SensorType } from './dto/sensor-type.enum';
import { Room } from '../rooms/room.entity';

@Entity({ name: 'sensors' })
export class Sensor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'enum', enum: SensorType, default: SensorType.Temperature })
  type!: SensorType;

  @Column({ type: 'varchar', length: 255 })
  location!: string;

  @Column({ type: 'boolean', nullable: false })
  isEnabled!: boolean;

  @Column({ type: 'double precision', default: 0 })
  value!: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unit!: string | null;

  @Column({ type: 'varchar', length: 50, default: 'unknown' })
  status!: string;

  @Column({ type: 'uuid', name: 'room_id', nullable: true })
  roomId!: string | null;

  @ManyToOne(() => Room, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'room_id', referencedColumnName: 'uid' })
  room?: Room | null;

  @UpdateDateColumn({ type: 'timestamptz', name: 'last_updated' })
  lastUpdated!: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}
