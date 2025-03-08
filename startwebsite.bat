@echo off

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
start "Node Express" cmd /k "node express.js"
popd

REM --- Wait for servers to start (adjust the delay as needed) ---
echo Waiting for servers to start...
timeout /t 10 /nobreak > nul

REM --- Open the website in the default browser ---
echo Opening website...
start "" http://localhost:5173  REM Change the URL if needed

echo Done.
exit /b 0