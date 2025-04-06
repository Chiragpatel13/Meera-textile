@echo off
echo Starting Mira Textile Management System...

REM Check if PostgreSQL is running and create database if needed
echo Checking PostgreSQL...
powershell -ExecutionPolicy Bypass -File "src\main\resources\db\check-postgres.ps1"

REM Start the Spring Boot application
echo Starting Spring Boot application...
call mvn spring-boot:run

pause 