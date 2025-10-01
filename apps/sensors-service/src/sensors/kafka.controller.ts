import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { SensorsService } from './sensors.service';

type SensorEvent =
  | { type: 'sensor.created'; payload: any }
  | { type: 'sensor.updated'; payload: any }
  | { type: 'sensor.deleted'; payload: { id: number | string } }
  | { type: string; payload?: any };

@Controller()
export class KafkaController {
  constructor(private readonly sensorsService: SensorsService) {}

  @EventPattern('sensor.events')
  async handleSensorEvents(@Payload() message: any, @Ctx() context: KafkaContext) {
    try {
      const raw = typeof message?.value === 'undefined' ? message : message.value?.toString();
      const event: SensorEvent = typeof raw === 'string' ? JSON.parse(raw) : raw;


        switch (event?.type) {
        case 'sensor.created': {
          if (!event.payload) return;
          await this.sensorsService.create({isEnabled:false,...event.payload});
          break;
        }
        case 'sensor.updated': {
          const id = Number(event?.payload?.id);
          if (!id || Number.isNaN(id)) return;
          await this.sensorsService.update(id, event.payload);
          break;
        }
        case 'sensor.deleted': {
          const id = Number(event?.payload?.id);
          if (!id || Number.isNaN(id)) return;
          await this.sensorsService.remove(id);
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
