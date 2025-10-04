import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { TelemetryService } from './telemetry.service';

type SensorEvent =
  | { type: 'sensor.created'; payload: any }
  | { type: 'sensor.updated'; payload: any }
  | { type: 'sensor.deleted'; payload: { id: number | string } }
  | { type: 'sensor.value_updated'; payload: { id: number | string; value?: number; status?: string } }
  | { type: string; payload?: any };

@Controller()
export class KafkaController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @EventPattern('sensor.events')
  async handleSensorEvents(@Payload() message: any, @Ctx() context: KafkaContext) {
    try {
      const raw = typeof message?.value === 'undefined' ? message : message.value?.toString();
      const event: SensorEvent = typeof raw === 'string' ? JSON.parse(raw) : raw;


        switch (event?.type) {
        case 'sensor.created': {
          if (!event.payload) return;
          await this.telemetryService.create(event.payload);
          break;
        }
        case 'sensor.deleted': {
          const id = Number(event?.payload?.id);
          if (!id || Number.isNaN(id)) return;
          // await this.telemetryService.remove(id);
          break;
        }
        default:

          console.warn('[KafkaController] Unknown event type:', event?.type);
      }
    } catch (err) {

      console.error('[KafkaController] Failed to process Kafka message', err);
    }
  }
}
