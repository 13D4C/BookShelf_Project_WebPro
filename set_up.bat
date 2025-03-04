npm Check and Installation (Global):

Checks if npm is in the system's PATH.

If not found, it provides instructions for installing Node.js (which includes npm) and exits. This is a user-friendly approach.

REM --- Check for Vite and install if needed ---
echo Checking for Vite...
where vite > nul 2>&1
if errorlevel 1 (
    echo Vite is not installed globally. Installing...
    npm install -g vite
    if errorlevel 1 (
        echo Error: Failed to install Vite.
        pause
        exit /b 1
    )
)

REM Check for vite in project's node_modules (local install)
pushd "%~dp0myapp" 2>nul
if errorlevel 1 (
  echo Error: myapp folder is not present at "%~dp0myapp".
  pause
  exit /b 1
)

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
popd

REM --- Run 'npm run dev' in the myapp directory ---
echo Running 'npm run dev' in ./myapp/...
set "myapp_dir=%~dp0myapp"
pushd "%myapp_dir%"
if errorlevel 1 (
    echo Error: Could not change directory to "%myapp_dir%".
    echo Please check the path and try again.
    pause
    exit /b 1
)
start "npm run dev" cmd /k "npm run dev"
popd

REM --- Run 'node ./express.js' in the blackend directory ---
echo Running 'node ./express.js' in ./myapp/blackend/...
set "blackend_dir=%~dp0myapp\blackend"
pushd "%blackend_dir%"
if errorlevel 1 (
    echo Error: Could not change directory to "%blackend_dir%".
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
start "Node Express" cmd /k "node express.js"
popd

echo Done.
exit /b 0
