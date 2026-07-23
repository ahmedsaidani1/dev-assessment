# Task Management - Legacy Application

This is a legacy task management application built to demonstrate the architecture before modernization.

## Architecture

### Current Stack (Legacy)
- **Backend**: Java + Play Framework 2.8
- **Frontend**: Backbone.js 1.4
- **Database**: H2 In-Memory Database (JPA/Hibernate)
- **Build Tool**: SBT (Scala Build Tool)

### Features
- ✅ View all tasks
- ✅ Create new tasks
- ✅ Update task status (TODO, IN_PROGRESS, DONE)
- ✅ Delete tasks
- ✅ RESTful API design
- ✅ Responsive UI

## Project Structure

```
task-management-legacy/
├── app/
│   ├── controllers/
│   │   ├── HomeController.java      # Serves the frontend
│   │   └── TaskController.java      # REST API endpoints
│   ├── models/
│   │   └── Task.java                # JPA Entity
│   ├── repositories/
│   │   ├── TaskRepository.java      # Data access layer
│   │   └── DatabaseExecutionContext.java
│   └── views/
│       └── index.scala.html         # Main HTML template
├── conf/
│   ├── application.conf             # Play configuration
│   ├── routes                       # URL routing
│   └── META-INF/
│       └── persistence.xml          # JPA configuration
├── public/
│   ├── javascripts/
│   │   └── app.js                   # Backbone.js application
│   └── stylesheets/
│       └── main.css                 # Styles
├── project/
│   ├── build.properties             # SBT version
│   └── plugins.sbt                  # Play plugin
└── build.sbt                        # Project dependencies
```

## API Endpoints

### Tasks API
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Request/Response Examples

#### Create Task
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete documentation",
  "description": "Write comprehensive docs for the API",
  "status": "TODO"
}
```

#### Update Task
```bash
PUT /api/tasks/1
Content-Type: application/json

{
  "title": "Complete documentation",
  "description": "Write comprehensive docs for the API",
  "status": "DONE"
}
```

## Prerequisites

- Java 8 or higher
- SBT 1.9.7 or higher

## Running the Application

1. **Install dependencies and compile**:
   ```bash
   sbt compile
   ```

2. **Run the application**:
   ```bash
   sbt run
   ```

3. **Access the application**:
   Open your browser and navigate to: `http://localhost:9000`

   The first request may take a few moments as Play compiles the application.

## Development

### Hot Reload
Play Framework supports hot reloading. Any changes to the code will be automatically compiled when you refresh the browser.

### Database
The application uses an H2 in-memory database. Data is reset when the application restarts.

### Testing the API

You can test the API using curl, Postman, or any HTTP client:

```bash
# Get all tasks
curl http://localhost:9000/api/tasks

# Create a task
curl -X POST http://localhost:9000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Test Description","status":"TODO"}'

# Update a task
curl -X PUT http://localhost:9000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Task","description":"Updated","status":"DONE"}'

# Delete a task
curl -X DELETE http://localhost:9000/api/tasks/1
```

## Technical Details

### Backend (Play Framework + Java)

**Advantages**:
- Robust MVC framework
- Built-in routing and dependency injection
- Asynchronous request handling
- Type-safe templating

**Challenges**:
- Java verbosity
- Scala dependencies (Play is built on Scala)
- Configuration complexity
- Limited modern tooling compared to newer frameworks

### Frontend (Backbone.js)

**Characteristics**:
- Minimal structure (Models, Collections, Views, Router)
- jQuery and Underscore.js dependencies
- Manual DOM manipulation
- Event-driven architecture

**Challenges**:
- No component model
- Tight coupling between views and DOM
- Manual memory management (zombie views)
- Limited ecosystem and tooling
- Difficult to maintain at scale

### Why Modernization is Needed

1. **Developer Experience**: Modern tools offer better DX with TypeScript, hot module replacement, and better debugging
2. **Performance**: React's virtual DOM and modern build tools provide better performance
3. **Maintainability**: Component-based architecture is easier to test and maintain
4. **Ecosystem**: Modern frameworks have larger ecosystems and better community support
5. **Talent Pool**: Easier to find developers familiar with React and NestJS
6. **Scalability**: Modern architecture patterns scale better for complex applications

## Next Steps

This application represents the "before" state. The next phase will involve:

1. **Analysis**: Identify patterns and anti-patterns in the current codebase
2. **Strategy**: Develop an incremental migration strategy
3. **Implementation**: Gradually replace components while maintaining functionality
4. **Testing**: Ensure feature parity throughout the migration

## License

MIT License - For demonstration purposes only
