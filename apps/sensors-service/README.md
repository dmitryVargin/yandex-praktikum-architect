# Device Control Service

NestJS service with PostgreSQL + TypeORM that provides CRUD endpoints for Sensors.

## Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm

## Setup

1. Install dependencies:
   npm install

2. Configure environment:
   - Copy `.env.example` to `.env` and adjust values if needed.

3. Run the service:
   - Development (watch mode): npm run start:dev
   - Production build: npm run build && npm run start

Service will run on http://localhost:${PORT:-3000}

## API

Base URL: `/sensors`

- Create Sensor
  - POST /sensors
  - Body:
    {
      "name": "Living Room Thermometer",
      "type": "temperature",
      "location": "Living Room",
      "unit": "°C"
    }

- List Sensors
  - GET /sensors

- Get Sensor by ID
  - GET /sensors/:id

- Update Sensor
  - PATCH /sensors/:id
  - Body (any subset):
    {
      "name": "New Name",
      "location": "Hall",
      "unit": "°C",
      "status": "active",
      "value": 23.4,
      "type": "temperature"
    }

- Delete Sensor
  - DELETE /sensors/:id

## Notes

- Database schema sync is enabled by default via `DB_SYNCHRONIZE=true` for local development. Disable it in production and use migrations.
- Columns:
  - id (number, primary key)
  - name (string, required)
  - type (enum: "temperature")
  - location (string, required)
  - value (number, default 0)
  - unit (string, optional)
  - status (string, default "unknown")
  - lastUpdated (timestamp, auto-updated on change)
  - createdAt (timestamp, auto-set on insert)
