# NestJS API - Task Management

Modern backend service for task management, running alongside Play Framework as part of incremental migration strategy.

## Overview

This NestJS application handles **POST /api/tasks** endpoint, demonstrating incremental backend migration from Play Framework to NestJS.

## Features

- ✅ RESTful API for task management
- ✅ TypeORM with SQLite
- ✅ Data validation with class-validator
- ✅ CORS enabled for Play Framework frontend
- ✅ Structured logging
- ✅ Health check endpoint

## Tech Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **ORM**: TypeORM
- **Database**: SQLite (in-memory for demo)
- **Validation**: class-validator, class-transformer

## Installation

```bash
npm install
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Watch Mode
```bash
npm run start:dev
```

## API Endpoints

### Tasks

#### Create Task (Migrated from Play)
```http
POST http://localhost:3000/api/tasks
Content-Type: application/json

{
  "title": "My Task",
  "description": "Task description",
  "status": "TODO"
}
```

#### Get All Tasks
```http
GET http://localhost:3000/api/tasks
```

#### Get Single Task
```http
GET http://localhost:3000/api/tasks/1
```

#### Update Task
```http
PUT http://localhost:3000/api/tasks/1
Content-Type: application/json

{
  "status": "DONE"
}
```

#### Delete Task
```http
DELETE http://localhost:3000/api/tasks/1
```

### Health Check
```http
GET http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "service": "nestjs-api",
  "timestamp": "2026-07-23T10:29:38.000Z",
  "port": 3000,
  "message": "NestJS backend is running alongside Play Framework"
}
```

## Environment Variables

```env
PORT=3000
DATABASE_URL=sqlite::memory:
JWT_SECRET=shared-secret-key-12345
```

## Project Structure

```
nestjs-api/
├── src/
│   ├── task/
│   │   ├── dto/
│   │   │   └── create-task.dto.ts
│   │   ├── task.controller.ts
│   │   ├── task.entity.ts
│   │   ├── task.module.ts
│   │   └── task.service.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── package.json
├── tsconfig.json
└── README.md
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Integration with Play Framework

### Current Setup

- **Play Framework** (Port 9000): Handles GET, PUT, DELETE operations
- **NestJS** (Port 3000): Handles POST operations
- **Frontend**: Routes requests based on operation type

### Routing Logic

```javascript
// In Backbone app.js
if (method === 'create') {
    // Route to NestJS
    options.url = 'http://localhost:3000/api/tasks';
} else {
    // Route to Play
    options.url = 'http://localhost:9000/api/tasks';
}
```

## CORS Configuration

CORS is enabled to allow requests from:
- `http://localhost:9000` (Play Framework frontend)
- `http://localhost:3000` (NestJS itself)

## Logging

All operations are logged with structured format:

```
[NestJS] POST /api/tasks - Creating task via NestJS
[NestJS] Task created with ID: 1
```

## Future Enhancements

- [ ] JWT authentication
- [ ] Database migration from SQLite to PostgreSQL
- [ ] API documentation with Swagger
- [ ] Rate limiting
- [ ] Request/response caching
- [ ] WebSocket support for real-time updates

## Migration Roadmap

### Phase 1 (Current)
✅ POST /api/tasks → NestJS

### Phase 2
- Migrate PUT /api/tasks/:id → NestJS
- Migrate DELETE /api/tasks/:id → NestJS

### Phase 3
- Migrate GET operations → NestJS
- Deprecate Play API endpoints

### Phase 4
- Remove Play Framework
- Full NestJS backend

## License

MIT
