# H2 Database Console Guide

## Accessing the Database Console

With the application running, you can now access the built-in H2 Database Console:

**URL**: http://localhost:9000/db/console

## Features

The console provides:

### ✅ Quick Query Buttons
- **All Tasks** - `SELECT * FROM tasks`
- **Count Tasks** - `SELECT COUNT(*) as total FROM tasks`
- **By Status** - `SELECT status, COUNT(*) as count FROM tasks GROUP BY status`
- **Show Tables** - `SHOW TABLES`
- **Table Schema** - Shows the structure of the tasks table

### ✅ Custom SQL Queries
You can write and execute any SQL query in the text area:

```sql
-- Select all tasks
SELECT * FROM tasks;

-- Find tasks by status
SELECT * FROM tasks WHERE status = 'TODO';

-- Get tasks created today
SELECT * FROM tasks WHERE CAST(createdAt AS DATE) = CURRENT_DATE;

-- Update a task
UPDATE tasks SET status = 'DONE' WHERE id = 1;

-- Delete a task
DELETE FROM tasks WHERE id = 1;

-- Get task count by status
SELECT status, COUNT(*) as count 
FROM tasks 
GROUP BY status;
```

## Database Connection Information

- **JDBC URL**: `jdbc:h2:mem:play`
- **Username**: `sa`
- **Password**: (empty)
- **Driver**: `org.h2.Driver`
- **Type**: In-Memory Database

## Table Schema

### TASKS Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| title | VARCHAR(255) | NOT NULL |
| description | VARCHAR(1000) | nullable |
| status | VARCHAR(255) | NOT NULL |
| createdAt | TIMESTAMP | nullable |
| updatedAt | TIMESTAMP | nullable |

## Usage Examples

### 1. View All Tasks
```sql
SELECT * FROM tasks;
```

### 2. View Recent Tasks
```sql
SELECT id, title, status, createdAt 
FROM tasks 
ORDER BY createdAt DESC 
LIMIT 10;
```

### 3. Count Tasks by Status
```sql
SELECT 
    status,
    COUNT(*) as count
FROM tasks
GROUP BY status;
```

### 4. Find Tasks with Specific Words
```sql
SELECT * FROM tasks 
WHERE title LIKE '%bug%' 
   OR description LIKE '%bug%';
```

### 5. Get Statistics
```sql
SELECT 
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN status = 'TODO' THEN 1 END) as todo,
    COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END) as in_progress,
    COUNT(CASE WHEN status = 'DONE' THEN 1 END) as done
FROM tasks;
```

### 6. View Database Metadata
```sql
-- Show all tables
SHOW TABLES;

-- Show columns of tasks table
SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'TASKS';

-- Show indexes
SELECT * FROM INFORMATION_SCHEMA.INDEXES 
WHERE TABLE_NAME = 'TASKS';
```

### 7. Modify Data
```sql
-- Update task status
UPDATE tasks 
SET status = 'DONE', updatedAt = CURRENT_TIMESTAMP 
WHERE id = 1;

-- Delete completed tasks
DELETE FROM tasks WHERE status = 'DONE';

-- Delete all tasks
DELETE FROM tasks;
```

## Important Notes

⚠️ **Data Persistence**
- This is an **in-memory** database
- Data is **lost when the application stops**
- Data persists only during the current session

⚠️ **Read-Only in Production**
- In production, you should disable this console or make it read-only
- Current implementation allows INSERT/UPDATE/DELETE for development

⚠️ **SQL Injection**
- Current console is for development only
- Do not expose in production without proper security

## Troubleshooting

### Console doesn't load
- Make sure the application is running
- Check http://localhost:9000/db/console
- Refresh the page

### Query fails
- Check SQL syntax
- Ensure table name is correct (TASKS in uppercase)
- Check column names match the schema

### No data showing
- Create some tasks first at http://localhost:9000
- Then refresh the console
- Run `SELECT * FROM tasks` to verify

## Alternative: Using External H2 Console

If you prefer the official H2 console, you can also:

1. Download H2 from: http://www.h2database.com/
2. Run the H2 console: `java -jar h2*.jar`
3. Use these settings:
   - **JDBC URL**: `jdbc:h2:tcp://localhost:9092/mem:play`
   - **Username**: `sa`
   - **Password**: (empty)

However, you'll need to enable TCP server in the application configuration.

## Quick Access

### From Main Application
Add this to the main page footer to quick access:

```html
<a href="/db/console" target="_blank">🗄️ Database Console</a>
```

### Bookmarklet
Create a bookmark with this URL for quick access:
```
http://localhost:9000/db/console
```

## Useful Queries Collection

```sql
-- Show all columns with their data types
SELECT COLUMN_NAME, TYPE_NAME, COLUMN_SIZE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'TASKS';

-- Show database size (in-memory)
SELECT SUM(FILE_SIZE) as SIZE_IN_BYTES 
FROM INFORMATION_SCHEMA.CONSTANTS;

-- Find tasks updated in last hour
SELECT * FROM tasks 
WHERE updatedAt > DATEADD('HOUR', -1, CURRENT_TIMESTAMP);

-- List tasks with long descriptions
SELECT id, title, LENGTH(description) as desc_length 
FROM tasks 
WHERE LENGTH(description) > 100
ORDER BY desc_length DESC;
```

---

**Pro Tip**: Keep the database console open in a separate tab while using the application to see real-time changes to the database! 🚀
