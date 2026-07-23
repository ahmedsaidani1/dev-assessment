@echo off
echo Starting H2 Database Console...
echo.
echo The H2 console will open in your browser automatically.
echo.
echo Connection Details:
echo   JDBC URL: jdbc:h2:tcp://localhost:9092/mem:play
echo   Username: sa
echo   Password: (leave empty)
echo.
echo Press Ctrl+C to stop the console.
echo.

java -cp "%USERPROFILE%\.m2\repository\com\h2database\h2\2.1.214\h2-2.1.214.jar" org.h2.tools.Console

pause
