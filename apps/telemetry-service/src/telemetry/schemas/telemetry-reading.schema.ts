import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'telemetry_readings', versionKey: false })
export class TelemetryReading {
  @Prop({ required: true })
  sensorId!: string;

  @Prop({ required: true })
  timestamp!: Date;

  @Prop({ required: true })
  value!: number;

  @Prop({ required: true, enum: ['C', 'F', 'HPa', 'Percent'] })
  unit!: 'C' | 'F' | 'HPa' | 'Percent';

  @Prop({ required: false, enum: ['OK', 'Error', 'Warning'] })
  status?: 'OK' | 'Error' | 'Warning';
}

export type TelemetryReadingDocument = HydratedDocument<TelemetryReading>;
export const TelemetryReadingSchema = SchemaFactory.createForClass(TelemetryReading);
