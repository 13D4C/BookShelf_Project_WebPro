@echo off
echo Checking project prerequisites...
echo STARTING CHECKS
pause

REM --- Check Node.js ---
echo.
echo --- Checking Node.js ---
echo BEFORE NODE CHECK
node -v
echo AFTER NODE CHECK, Errorlevel: %errorlevel%
pause
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install it from https://nodejs.org/.
    goto :end_with_error
)
for /f "tokens=2 delims=v" %%a in ('node -v') do (
  set "node_version=%%a"
)
echo Node.js version: %node_version%
pause

REM ... (rest of the Node.js check) ...

REM --- Check npm ---
echo.
echo --- Checking npm ---
echo BEFORE NPM CHECK
npm -v
echo AFTER NPM CHECK, Errorlevel: %errorlevel%
pause
if errorlevel 1 (
    echo Error: npm is not installed. It usually comes with Node.js. Reinstall Node.js.
    goto :end_with_error
)
for /f "tokens=*" %%a in ('npm -v') do (
    set "npm_version=%%a"
)
echo npm version: %npm_version%
pause
REM ... (rest of the script) ...

REM --- Check Express (check in package.json) ---
:check_express
echo.
echo --- Checking Express (in package.json) ---
echo BEFORE PUSHD EXPRESS
pushd "%~dp0myapp\blackend"
echo AFTER PUSHD EXPRESS, Errorlevel: %errorlevel%
pause

if errorlevel 1 (
    echo Error: Could not change directory to "%~dp0myapp\blackend". Cannot check Express version.
    popd
    goto :end
)
setlocal EnableDelayedExpansion
for /f "tokens=3 delims=:" %%a in ('findstr /i "\"express\"" package.json') do (
    set "express_version=%%a"
    set "express_version=!express_version:~1,-2!"
)

if "!express_version!"=="" (
  echo "Warning: express dependency not found in package.json within ./myapp/blackend"
)
endlocal

popd
echo Express version (from package.json): %express_version%
pause

REM ... (rest of the script. Add similar echo/pause blocks to other sections) ...

:end
echo.
echo All checks completed successfully.

REM --- Run startwebsite.bat and open the website ---
echo Starting the application...
echo BEFORE CALLING STARTWEBSITE
call startwebsite.bat
echo AFTER CALLING STARTWEBSITE, Errorlevel: %errorlevel%
pause  <-- Add a pause here to see if startwebsite.bat is the issue
goto :end_no_pause

REM ... (rest of the script) ...
