@echo off

REM --- Run 'npm run dev' in the myapp directory ---
echo Running 'npm run dev' in ./myapp/...

REM Construct the path to the myapp directory
set "myapp_dir=%~dp0myapp"

REM Change to the myapp directory (with error handling)
pushd "%myapp_dir%"
if errorlevel 1 (
    echo Error: Could not change directory to "%myapp_dir%".
    echo Please check the path and try again.
    pause
    exit /b 1
)

REM Start the npm command in a *new* window, keeping it open
start "npm run dev" cmd /k "npm run dev"

REM Return to the original directory
popd

REM --- Run 'node ./express.js' in the blackend directory ---
echo Running 'node ./express.js' in ./myapp/blackend/...

REM Construct the path to the blackend directory
set "blackend_dir=%~dp0myapp\blackend"

REM Change to the blackend directory (with error handling)
pushd "%blackend_dir%"
if errorlevel 1 (
    echo Error: Could not change directory to "%blackend_dir%".
    echo Please check the path and try again.
    pause
    exit /b 1
)

REM Start the node command in a *new* window, keeping it open
start "Node Express" cmd /k "node express.js"

REM Return to the original directory
popd

echo Done.
exit /b 0