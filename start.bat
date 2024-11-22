@echo off
@REM npm i
@REM IF %ERRORLEVEL% NEQ 0 (
@REM     echo Failed to install dependencies
@REM     pause
@REM )

echo Starting server...
node server.js
IF %ERRORLEVEL% NEQ 0 (
    echo Server failed to start
    pause
)
pause