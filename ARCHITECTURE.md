# Application Architecture

## Current Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         BROWSER                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Backbone.js Application                   │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────┐  │  │
│  │  │   Models   │  │ Collections│  │     Views      │  │  │
│  │  │  (Task)    │  │ (TaskList) │  │ (TaskItemView) │  │  │
│  │  └────────────┘  └────────────┘  └────────────────┘  │  │
│  │         │               │                  │          │  │
│  │         └───────────────┴──────────────────┘          │  │
│  │                         │                              │  │
│  │                    REST API Calls                      │  │
│  │                  (jQuery.ajax)                         │  │
│  └─────────────────────────┼─────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────┘
                             │
                      HTTP/JSON
                             │
┌────────────────────────────┼────────────────────────────────┐
│                   PLAY FRAMEWORK SERVER                      │
│  ┌─────────────────────────┼─────────────────────────────┐  │
│  │                      Routes                            │  │
│  │              (conf/routes)                             │  │
│  └─────────────────────────┬─────────────────────────────┘  │
│                             │                                │
│  ┌──────────────────────────┼──────────────────────────┐    │
│  │              Controllers Layer                       │    │
│  │  ┌───────────────────┐  ┌──────────────────────┐    │    │
│  │  │  HomeController   │  │   TaskController     │    │    │
│  │  │  (Serves HTML)    │  │   (REST API)         │    │    │
│  │  └───────────────────┘  └──────────┬───────────┘    │    │
│  └───────────────────────────────────┬─────────────────┘    │
│                                      │                       │
│  ┌──────────────────────────────────┼─────────────────┐     │
│  │            Repository Layer      │                 │     │
│  │  ┌───────────────────────────────┴──────────────┐  │     │
│  │  │          TaskRepository                      │  │     │
│  │  │  (JPA Transactions, CRUD Operations)         │  │     │
│  │  └───────────────────┬──────────────────────────┘  │     │
│  └────────────────────────┬────────────────────────────┘     │
│                           │                                  │
│  ┌────────────────────────┼────────────────────────────┐     │
│  │               Model/Entity Layer                    │     │
│  │  ┌────────────────────┴──────────────────────┐      │     │
│  │  │            Task (JPA Entity)              │      │     │
│  │  │  - id, title, description, status         │      │     │
│  │  │  - createdAt, updatedAt                   │      │     │
│  │  └───────────────────┬───────────────────────┘      │     │
│  └────────────────────────┬────────────────────────────┘     │
└─────────────────────────┬─┴────────────────────────────────┘
                          │ JPA/Hibernate
                          │
┌─────────────────────────┼────────────────────────────────────┐
│                  H2 In-Memory Database                        │
│  ┌──────────────────────┴──────────────────────────────┐     │
│  │                 TASKS Table                          │     │
│  │  ┌────────────────────────────────────────────┐     │     │
│  │  │ id | title | description | status |        │     │     │
│  │  │    | createdAt | updatedAt                 │     │     │
│  │  └────────────────────────────────────────────┘     │     │
│  └──────────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Backend
- **Framework**: Play Framework 2.8 (Java)
- **Language**: Java 8+
- **ORM**: Hibernate (JPA)
- **Database**: H2 (In-Memory)
- **Build Tool**: SBT (Scala Build Tool)
- **Dependency Injection**: Guice (built into Play)

### Frontend
- **Framework**: Backbone.js 1.4
- **Dependencies**: 
  - jQuery 3.6 (DOM manipulation, AJAX)
  - Underscore.js 1.13 (utilities, templating)
- **Architecture**: MVC pattern
- **Rendering**: Client-side templating with Underscore

## Request Flow

### Viewing Tasks (GET /api/tasks)

1. **Browser**: User opens application
2. **Play**: Serves `index.scala.html` with Backbone.js app
3. **Backbone**: `TaskCollection.fetch()` triggers GET request
4. **Play Routes**: Routes to `TaskController.getTasks()`
5. **Controller**: Calls `TaskRepository.list()`
6. **Repository**: Executes JPA query `SELECT * FROM tasks`
7. **Database**: Returns task rows
8. **Response**: JSON array flows back through layers
9. **Backbone**: Collection updates, triggers view re-render
10. **Browser**: DOM updated with task list

### Creating a Task (POST /api/tasks)

1. **Browser**: User submits form
2. **Backbone**: `TaskFormView` captures submit event
3. **Model**: Creates new `Task` model with form data
4. **AJAX**: `task.save()` sends POST to `/api/tasks`
5. **Play Routes**: Routes to `TaskController.createTask()`
6. **Controller**: 
   - Parses JSON body
   - Validates required fields
   - Calls `TaskRepository.create(task)`
7. **Repository**: 
   - Begins JPA transaction
   - Persists task entity
   - Commits transaction
8. **Database**: Inserts row, generates ID
9. **Response**: Returns created task with ID as JSON
10. **Backbone**: Adds task to collection
11. **View**: Renders new task in UI

### Updating Status (PUT /api/tasks/:id)

1. **Browser**: User selects new status from dropdown
2. **Backbone**: `TaskItemView` captures change event
3. **Model**: `task.save({status: newStatus}, {patch: true})`
4. **AJAX**: Sends PUT to `/api/tasks/1` with updated status
5. **Play Routes**: Routes to `TaskController.updateTask(id)`
6. **Controller**: Calls `TaskRepository.update(id, taskData)`
7. **Repository**:
   - Finds task by ID
   - Updates status field
   - Merges changes
8. **Database**: Updates row
9. **Response**: Returns updated task as JSON
10. **Backbone**: Model updates, view re-renders status badge

## Data Model

### Task Entity

```java
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;              // Auto-generated primary key
    
    @Column(nullable = false)
    private String title;         // Required field
    
    @Column(length = 1000)
    private String description;   // Optional, max 1000 chars
    
    @Column(nullable = false)
    private String status;        // TODO, IN_PROGRESS, DONE
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;       // Auto-set on creation
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;       // Auto-updated via @PreUpdate
}
```

### Status Values
- `TODO` - Task not started
- `IN_PROGRESS` - Task currently being worked on
- `DONE` - Task completed

## API Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/tasks` | List all tasks | - | Array of tasks |
| GET | `/api/tasks/:id` | Get single task | - | Task object |
| POST | `/api/tasks` | Create task | Task JSON | Created task |
| PUT | `/api/tasks/:id` | Update task | Task JSON | Updated task |
| DELETE | `/api/tasks/:id` | Delete task | - | 204 No Content |

## Key Patterns

### Backend Patterns

1. **Repository Pattern**: Separates data access logic from business logic
2. **Dependency Injection**: Controllers receive dependencies via Guice
3. **Async Processing**: Uses `CompletionStage<>` for non-blocking operations
4. **Transaction Management**: JPA handles transaction boundaries
5. **DTO Pattern**: JSON serialization via Jackson (implicit)

### Frontend Patterns

1. **MVC Pattern**: Models, Views, Collections clearly separated
2. **Event-Driven**: Views listen to model changes
3. **RESTful**: Models sync automatically with server via Backbone.sync
4. **Template Rendering**: Underscore templates for dynamic HTML
5. **Collection Management**: Backbone Collections handle sorting and filtering

## Challenges with Current Architecture

### Backend
- **Verbosity**: Java requires significant boilerplate
- **Mixed Languages**: SBT and Play use Scala internally
- **Configuration**: Multiple config files (application.conf, persistence.xml, routes)
- **Type Safety**: Limited compile-time guarantees for JSON handling

### Frontend
- **No Components**: Views are not reusable components
- **Manual DOM**: Direct DOM manipulation is error-prone
- **Memory Leaks**: Zombie views if not properly cleaned up
- **No Type Safety**: JavaScript lacks type checking
- **Testing**: Difficult to unit test views
- **State Management**: No centralized state, scattered across models

### Integration
- **No Shared Types**: Backend and frontend types are separate
- **Manual Serialization**: JSON mapping is implicit and unverified
- **API Documentation**: No automatic API docs or contracts

## Next Steps: Modernization Goals

The target architecture will address these challenges:
- **TypeScript**: Type safety across frontend and backend
- **React**: Component-based UI with better state management
- **NestJS**: Modern Node.js framework with decorators and DI
- **Shared Types**: Single source of truth for data models
- **Better Tooling**: Hot reload, better debugging, automated testing
