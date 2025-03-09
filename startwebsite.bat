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

REM Use a temporary file to capture the output of npm run dev
set "temp_output_file=%temp%\npm_dev_output.txt"

REM Run npm run dev, redirecting both standard output and standard error to the temp file
start "npm run dev" cmd /k "npm run dev > "%temp_output_file%" 2>&1 & exit"
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

REM --- Wait for the server to start and the output file to be written ---
echo Waiting for servers to start and port information...
timeout /t 5 /nobreak > nul

REM --- Extract the port from the output file ---
set "port="
set "found_port=false"

REM Loop through the output file line by line
for /f "tokens=*" %%a in ('type "%temp_output_file%"') do (
    echo Processing line: %%a

    REM Check for common port patterns (Vite, Webpack, etc.)
    REM Adjust these patterns as needed for your specific dev server!
    for /f "tokens=1-4 delims=: " %%b in ("%%a") do (
        if "%%d"=="Local" (
           
            set "port=%%c"
			set "found_port=true"
			
        )
    )

	if "%%found_port%%"=="true" goto :port_found
)
:port_found
REM --- Clean up the temporary file ---
del "%temp_output_file%"

REM --- Check if the port was found ---
if "%port%"=="" (
    echo Error: Could not determine the port from 'npm run dev' output.
	echo check  "%temp_output_file%"
    echo Using default port 5173.
    set "port=5173"
)

REM --- Open the website in the default browser ---
echo Opening website on port %port%...
start "" "http://localhost:%port%"

echo Done.
exit /b 0
