export type TelemetryReading = {
    _id?: string;

    sensorId: string;

    timestamp: Date;

    value: number;

    unit: 'C' | 'F' | 'HPa' | 'Percent';

    status?: 'OK' | 'Error' | 'Warning';
};