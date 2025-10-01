import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelemetryModule } from './telemetry/telemetry.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const DEFAULT_MONGO_URI =
    process.env.MONGO_URI ||
    'mongodb://telemetry_admin:telemetry_password@telemetry-mongodb:27017/telemetry?authSource=admin';

@Module({
    imports: [
        MongooseModule.forRoot(DEFAULT_MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        }),
        TelemetryModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}