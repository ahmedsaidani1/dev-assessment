# Quick Start Guide

## Installation (First Time)

1. **Install Java** (if not already installed):
   - Download from: https://www.oracle.com/java/technologies/downloads/
   - Verify: `java -version`

2. **Install SBT** (Scala Build Tool):
   
   **Windows (using Chocolatey)**:
   ```bash
   choco install sbt
   ```
   
   **macOS**:
   ```bash
   brew install sbt
   ```
   
   **Manual Download**:
   - Visit: https://www.scala-sbt.org/download.html
   - Follow installation instructions for your OS

3. **Verify Installation**:
   ```bash
   sbt --version
   ```

## Running the Application

1. **Open terminal in project directory**

2. **Start the application**:
   ```bash
   sbt run
   ```
   
   First run will download dependencies (may take 3-5 minutes).

3. **Wait for the server to start**:
   You'll see: `(Server started, use Enter to stop and go back to the console...)`

4. **Open your browser**:
   Navigate to: http://localhost:9000

5. **First request**: The very first page load will be slow (30-60 seconds) as Play compiles templates. Subsequent requests will be fast.

## Using the Application

1. **Create a task**:
   - Fill in the "Title" field (required)
   - Optionally add a description
   - Select a status
   - Click "Create Task"

2. **Update task status**:
   - Use the dropdown in each task card
   - Changes save automatically

3. **Delete a task**:
   - Click the "Delete" button
   - Confirm the deletion

## Stopping the Application

Press `Ctrl+C` in the terminal (or `Enter` if in SBT console)

## Troubleshooting

**Issue**: Port 9000 is already in use  
**Solution**: Run on a different port: `sbt "run 8080"` then access at http://localhost:8080

**Issue**: SBT is very slow or crashes  
**Solution**: Increase memory:
```bash
# Windows
set SBT_OPTS=-Xmx2G
sbt run

# macOS/Linux
export SBT_OPTS="-Xmx2G"
sbt run
```

**Issue**: First page load times out  
**Solution**: Be patient. The first request can take 30-60 seconds. Check terminal logs for compilation progress.

**Issue**: Changes not reflected  
**Solution**: Play has auto-reload. Wait for compilation in terminal, then refresh browser.

## What You Should See

✅ A purple gradient header with "Task Management System"  
✅ A form to create new tasks  
✅ A list of tasks below (initially empty)  
✅ Ability to change status via dropdown  
✅ Delete button for each task  

## Testing the API Directly

While the app is running, open another terminal:

```bash
# Create a task
curl -X POST http://localhost:9000/api/tasks -H "Content-Type: application/json" -d "{\"title\":\"API Test\",\"status\":\"TODO\"}"

# Get all tasks
curl http://localhost:9000/api/tasks
```

## Next Steps

Once you have the application running:
1. Explore the codebase structure
2. Review the README.md for architecture details
3. Proceed to Part 2: Migration Strategy Planning

## Need Help?

- Review SETUP_GUIDE.md for detailed instructions
- Check README.md for architecture documentation
- SBT Documentation: https://www.scala-sbt.org/documentation.html
- Play Framework Docs: https://www.playframework.com/documentation/2.8.x/Home
