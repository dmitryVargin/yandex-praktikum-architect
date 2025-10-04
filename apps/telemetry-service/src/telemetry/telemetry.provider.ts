import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class TelemetryInitializer implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    const collectionName = 'telemetry_readings';

    if (!this.connection.db) {
      await this.connection.asPromise();
    }
    const db = this.connection.db!;

    const existing = await db.listCollections({ name: collectionName }).toArray();
    if (existing.length === 0) {
      await db.createCollection(collectionName);
    }

    // Ensure index for efficient queries
    await db.collection(collectionName).createIndex({ sensorId: 1, timestamp: -1 });
  }
}
