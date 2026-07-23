# Setup Guide

## Installing Prerequisites

### Java
Check if Java is installed:
```bash
java -version
```

If not installed, download from: https://www.oracle.com/java/technologies/downloads/

### SBT (Scala Build Tool)
Check if SBT is installed:
```bash
sbt --version
```

If not installed:

**Windows**:
```bash
# Using Chocolatey
choco install sbt

# Or download installer from:
# https://www.scala-sbt.org/download.html
```

**macOS**:
```bash
brew install sbt
```

**Linux**:
```bash
# Ubuntu/Debian
echo "deb https://repo.scala-sbt.org/scalasbt/debian all main" | sudo tee /etc/apt/sources.list.d/sbt.list
curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x2EE0EA64E40A89B84B2DF73499E82A75642AC823" | sudo apt-key add
sudo apt-get update
sudo apt-get install sbt
```

## Running the Application

1. **Navigate to the project directory**:
   ```bash
   cd task-management-legacy
   ```

2. **Compile the project** (first time):
   ```bash
   sbt compile
   ```
   
   This will download all dependencies and compile the application. It may take a few minutes on the first run.

3. **Run the application**:
   ```bash
   sbt run
   ```
   
   The application will start on port 9000.

4. **Access the application**:
   Open your browser and go to: http://localhost:9000

## Common Issues

### Port Already in Use
If port 9000 is already in use, you can run on a different port:
```bash
sbt "run 8080"
```

### SBT Memory Issues
If you encounter OutOfMemory errors, increase SBT memory:

**Windows**:
```bash
set SBT_OPTS=-Xmx2G -XX:+UseConcMarkSweepGC -XX:+CMSClassUnloadingEnabled
sbt run
```

**macOS/Linux**:
```bash
export SBT_OPTS="-Xmx2G -XX:+UseConcMarkSweepGC -XX:+CMSClassUnloadingEnabled"
sbt run
```

### First Request is Slow
The first HTTP request to a Play application is typically slow because Play compiles routes and templates on-demand. This is normal development behavior.

### Hot Reload Not Working
If changes aren't reflected:
1. Make sure you're in development mode (running `sbt run`)
2. Wait for the compilation message in the console
3. Refresh your browser

## Development Workflow

1. Start SBT in interactive mode:
   ```bash
   sbt
   ```

2. Run the application:
   ```
   run
   ```

3. In another terminal, make changes to code

4. Refresh browser - Play will automatically recompile

5. To stop, press `Ctrl+D` or type `exit`

## Testing the Application

### Manual Testing
1. Open the application in your browser
2. Create a few tasks
3. Change their status
4. Delete tasks
5. Refresh the page to see persistence (in-memory, so data resets on restart)

### API Testing with curl

```bash
# Create a task
curl -X POST http://localhost:9000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Description here","status":"TODO"}'

# Get all tasks
curl http://localhost:9000/api/tasks

# Update task (replace 1 with actual task ID)
curl -X PUT http://localhost:9000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","description":"New description","status":"DONE"}'

# Delete task
curl -X DELETE http://localhost:9000/api/tasks/1
```

## Next Steps

Once the application is running successfully, you can proceed with Part 2 of the assessment - planning and implementing the modernization strategy.
