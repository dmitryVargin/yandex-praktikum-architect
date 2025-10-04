import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';

/**
 * Periodically pulls temperature by sensor id from temperature-api and stores it in MongoDB.
 * Uses setInterval to avoid extra dependencies. Interval: every 10 seconds.
 */
@Injectable()
export class TemperaturePollerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TemperaturePollerService.name);
  private timer?: NodeJS.Timeout;

  constructor(private readonly telemetryService: TelemetryService) {}

  onModuleInit() {
    const baseUrl = process.env.TEMPERATURE_API_URL || 'http://temperature-api:8081';
    const sensorId = process.env.SENSOR_ID || '1';
    const intervalMs = Number(process.env.POLL_INTERVAL_MS || 10_000);

    const run = async () => {
      try {
        const url = `${baseUrl.replace(/\/$/, '')}/temperature/${encodeURIComponent(sensorId)}`;
        const fetchFn: any = (globalThis as any).fetch;
        if (typeof fetchFn !== 'function') {
          this.logger.error('global fetch is not available in this runtime');
          return;
        }
        const res = await fetchFn(url, { method: 'GET' });
        if (!res.ok) {
          this.logger.warn(`Temperature API responded with ${res.status}: ${res.statusText}`);
          return;
        }
        const data = await res.json();
        const value = Number(data?.value);
        if (Number.isNaN(value)) {
          this.logger.warn('Temperature API returned invalid value');
          return;
        }

        // Map unit to DTO enum
        let unit: 'C' | 'F' | 'HPa' | 'Percent' = 'C';
        const rawUnit = (data?.unit as string | undefined) || 'C';
        if (rawUnit.includes('F')) unit = 'F';
        else unit = 'C'; // treat anything else as Celsius

        const sensorIdStr: string = String(data?.sensor_id ?? sensorId);
        const timestamp = data?.timestamp ? new Date(data.timestamp) : new Date();

        await this.telemetryService.create({
          sensorId: sensorIdStr,
          value,
          unit,
          timestamp
        });
      } catch (err) {
        this.logger.error('Failed to poll temperature-api', err as Error);
      }
    };

    run().catch(() => undefined);
    this.timer = setInterval(() => {
      run().catch(() => undefined);
    }, intervalMs);

    this.logger.log(`Temperature poller started: base=${baseUrl}, sensorId=${sensorId}, every ${intervalMs}ms`);
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
