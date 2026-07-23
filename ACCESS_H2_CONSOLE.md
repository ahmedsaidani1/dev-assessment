# How to Access H2 Database Console

## Simple Method: View Data via API

The easiest way to see your data is through the API:

1. **Open your browser** and go to: http://localhost:9000/api/tasks
2. You'll see all tasks in JSON format

## Method 1: Using H2's Built-in Console (Recommended)

Since you have H2 2.1.214, you can start the H2 console separately:

### Step 1: Open a NEW Command Prompt

Don't close your running application! Open a **new** terminal/command prompt window.

### Step 2: Navigate to Your Project

```cmd
cd "C:\Users\ahmed\Desktop\developer assesment"
```

### Step 3: Find the H2 JAR

The H2 jar is in your local Maven/Ivy cache. Run this command:

```cmd
dir /s /b "%USERPROFILE%\.ivy2\cache\com.h2database\h2\jars\h2-2.1.214.jar"
```

### Step 4: Start H2 Console

Once you find the path, run (replace with actual path):

```cmd
java -jar "C:\Users\ahmed\.ivy2\cache\com.h2database\h2\jars\h2-2.1.214.jar"
```

Or if you have Maven cache:

```cmd
java -jar "%USERPROFILE%\.m2\repository\com\h2database\h2\2.1.214\h2-2.1.214.jar"
```

### Step 5: Connect to Database

The H2 console will open in your browser automatically. Use these settings:

```
Driver Class:  org.h2.Driver
JDBC URL:      jdbc:h2:mem:play
Username:      sa
Password:      (leave empty)
```

Click **Connect**!

## Method 2: Quick SQL Queries via curl

You can query the database through the API:

```bash
# Get all tasks
curl http://localhost:9000/api/tasks

# Get a specific task
curl http://localhost:9000/api/tasks/1

# Create a task (to see data in DB)
curl -X POST http://localhost:9000/api/tasks -H "Content-Type: application/json" -d "{\"title\":\"Test\",\"status\":\"TODO\"}"
```

## Method 3: Check Server Logs

The application logs all SQL queries. Look at your server terminal to see:

```sql
Hibernate: select task0_.id as id1_0_, task0_.createdAt as createda2_0_ ...
Hibernate: insert into tasks (id, createdAt, description, status, title, updatedAt) values ...
```

## Troubleshooting

### Can't find H2 jar

Run this in PowerShell:

```powershell
Get-ChildItem -Path "$env:USERPROFILE\.ivy2" -Filter "h2-*.jar" -Recurse -ErrorAction SilentlyContinue | Select-Object FullName
```

### H2 Console won't start

Download H2 directly:

1. Go to: https://www.h2database.com/html/download.html
2. Download "Platform-Independent Zip"
3. Extract and run: `java -jar h2/bin/h2-2.1.214.jar`

### Can't connect to database

The database is **in-memory** which means:
- It only exists while the Play application is running
- It's not accessible via TCP by default
- You need to use the in-memory URL: `jdbc:h2:mem:play`

## What You Can See

### Tables
- `TASKS` - Your main tasks table

### Sample Queries

Once connected to H2 console, try:

```sql
-- See all tasks
SELECT * FROM TASKS;

-- Count tasks
SELECT COUNT(*) FROM TASKS;

-- Group by status
SELECT STATUS, COUNT(*) as COUNT 
FROM TASKS 
GROUP BY STATUS;

-- Recent tasks
SELECT ID, TITLE, STATUS, CREATEDAT 
FROM TASKS 
ORDER BY CREATEDAT DESC;
```

## Notes

⚠️ **Data is in-memory**
- Data exists only while the application runs
- Restarting the app = data is lost
- Perfect for development!

✅ **Easy alternative**: Just use http://localhost:9000/api/tasks to see all data in JSON!

---

**Pro Tip**: Keep the main application (http://localhost:9000) open in one tab and the API endpoint (http://localhost:9000/api/tasks) in another to see real-time updates!
