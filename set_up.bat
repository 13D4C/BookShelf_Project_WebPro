@echo off

REM --- Check for npm and install if needed ---
echo Checking for npm...
where npm > nul 2>&1
if errorlevel 1 (
    echo npm is not installed. Installing using winget...

    REM Check if winget is available
    where winget > nul 2>&1
    if errorlevel 1 (
        echo Error: winget (Windows Package Manager) is not available.
        echo Please install Node.js manually from https://nodejs.org/
        pause
        exit /b 1
    )

    REM Install Node.js LTS using winget
    winget install -e --id OpenJS.NodeJS.LTS
    if errorlevel 1 (
        echo Error: Failed to install Node.js using winget.
        echo Please install Node.js manually from https://nodejs.org/
        pause
        exit /b 1
    )

    echo Node.js (and npm) installed successfully.
    echo You may need to restart your command prompt or terminal for the changes to take effect.
    pause  REM Allow user to see the message
    exit /b 1  REM Exit so they can restart the command prompt
)

echo npm is installed.

REM --- Navigate to myapp ---
pushd "%~dp0myapp" 2>nul
if errorlevel 1 (
  echo Error: myapp folder is not present at "%~dp0myapp".
  pause
  exit /b 1
)

REM --- Check for Vite and install if needed (Local First) ---
echo Checking for Vite in myapp...

REM Check for vite in project's node_modules (local install)
where /q vite
if errorlevel 1 (
	echo Vite is not present installing in the project...
	npm install vite
    if errorlevel 1 (
        echo Error: Failed to install Vite.
        pause
        exit /b 1
    )
)

REM --- Run 'npm run dev' in the myapp directory ---
echo Running 'npm run dev' in ./myapp/...
start "npm run dev" cmd /k "npm run dev"

popd

REM --- Navigate to blackend ---
pushd "%~dp0myapp\blackend" 2>nul
if errorlevel 1 (
    echo Error: Could not change directory to "%~dp0myapp\blackend".
    echo Please check the path and try again.
    pause
    exit /b 1
)

REM --- Check for express in project's node_modules (local install) ---
echo Checking for express in blackend directory...
where /q express
if errorlevel 1 (
    echo express is not present, installing in the blackend project...
    npm install express
    if errorlevel 1 (
        echo Error: Failed to install express.
        pause
        exit /b 1
    )
)

REM Now, it's safe to run the Express server.
echo Running 'node ./express.js' in ./myapp/blackend/...
start "Node Express" cmd /k "node express.js"

popd

echo Done.
exit /b 0
