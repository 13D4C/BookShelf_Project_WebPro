@echo off
REM --- Debugging Version - set_up.bat ---

REM Redirect all output to a file for debugging
echo Debugging set_up.bat > debug_log.txt
date /t >> debug_log.txt
time /t >> debug_log.txt

echo --- Starting Checks --- >> debug_log.txt

REM --- Check if myapp directory exists ---
echo Checking if myapp directory exists... >> debug_log.txt
if not exist "%~dp0myapp" (
    echo Error: myapp directory not found. >> debug_log.txt
    goto :end_with_error
)
echo myapp directory found. >> debug_log.txt

REM --- Check Permissions (icacls) ---
echo. >> debug_log.txt
echo --- Checking Permissions on myapp --- >> debug_log.txt
icacls "%~dp0myapp" >> debug_log.txt 2>&1
echo --- End Permissions Check --- >> debug_log.txt

REM --- Check Node.js ---
echo. >> debug_log.txt
echo --- Checking Node.js --- >> debug_log.txt
node -v >> debug_log.txt 2>&1
if errorlevel 1 (
    echo Error: Node.js check failed. >> debug_log.txt
    goto :end_with_error
)
echo Node.js check successful. >> debug_log.txt

REM --- Check npm ---
echo. >> debug_log.txt
echo --- Checking npm --- >> debug_log.txt
npm -v >> debug_log.txt 2>&1
if errorlevel 1 (
    echo Error: npm check failed. >> debug_log.txt
    goto :end_with_error
)
echo npm check successful. >> debug_log.txt

REM --- Check if startwebsite.bat exists---
echo. >> debug_log.txt
echo --- Checking if startwebsite.bat exists--- >> debug_log.txt
IF NOT EXIST "%~dp0startwebsite.bat" (
	echo Error: startwebsite.bat not found >> debug_log.txt
	goto :end_with_error
)
echo startwebsite.bat found. >> debug_log.txt

REM --- Check Svelte (using svelte-check) ---
echo. >> debug_log.txt
echo --- Checking Svelte (using svelte-check) --- >> debug_log.txt

echo BEFORE where svelte-check >> debug_log.txt
where svelte-check > nul 2>&1
echo AFTER where svelte-check, Errorlevel: %errorlevel% >> debug_log.txt
if errorlevel 1 (
    echo Error: svelte-check is not installed globally. Run 'npm install -g svelte-check'. >> debug_log.txt
    goto :end_with_error
)

REM --- Try CHDIR instead of CD/PUSHD ---
echo --- Trying CHDIR instead of CD/PUSHD --- >> debug_log.txt
echo BEFORE chdir "%~dp0myapp" >> debug_log.txt
chdir "%~dp0myapp" >> debug_log.txt 2>&1
echo AFTER chdir "%~dp0myapp", Errorlevel: %errorlevel% >> debug_log.txt
if errorlevel 1 (
    echo Error: Could not change directory to "%~dp0myapp" using CHDIR. >> debug_log.txt
    goto :end_with_error  <-- Notice we don't try to go back
)

echo BEFORE svelte-check --version >> debug_log.txt
svelte-check --version 2>&1 | findstr /i "svelte" >> debug_log.txt
echo AFTER svelte-check --version, Errorlevel: %errorlevel% >> debug_log.txt

if errorlevel 1 (
   echo "Warning: Could not determine Svelte version.  'svelte-check --version' output did not contain 'svelte'." >> debug_log.txt
)

for /f "tokens=2 delims=-v" %%a in ('svelte-check --version 2^>^&1 ^| findstr /i "svelte"') do (
  set "svelte_ver=%%a"
)

chdir "%~dp0"  <-- Change back to the script's directory
echo Svelte version: %svelte_ver% >> debug_log.txt

REM --- Check Express (using chdir) ---
echo. >> debug_log.txt
echo --- Checking Express --- >> debug_log.txt
echo BEFORE chdir "%~dp0myapp\blackend" >> debug_log.txt
chdir "%~dp0myapp\blackend" >> debug_log.txt 2>&1
echo AFTER chdir "%~dp0myapp\blackend", Errorlevel: %errorlevel% >> debug_log.txt

if errorlevel 1 (
	echo Error: Could not change directory to "%~dp0myapp/blackend". >> debug_log.TXT
	goto :end
)

setlocal EnableDelayedExpansion
for /f "tokens=3 delims=:" %%a in ('findstr /i "\"express\"" package.json') do (
    set "express_version=%%a"
    set "express_version=!express_version:~1,-2!"
)

if "!express_version!"=="" (
  echo "Warning: express dependency not found in package.json within ./myapp/blackend" >> debug_log.txt
)
endlocal

chdir "%~dp0"
echo Express version (from package.json): %express_version% >> debug_log.txt

REM --- Check Vite (using chdir)---
echo. >> debug_log.txt
echo --- Checking Vite --- >> debug_log.txt
echo BEFORE CHDIR "%~dp0myapp" >> debug_log.txt
chdir "%~dp0myapp" >> debug_log.txt 2>&1
echo AFTER CHDIR "%~dp0myapp", Errorlevel: %errorlevel% >> debug_log.txt

if errorlevel 1 (
    echo Error: Could not change directory to "%~dp0myapp".  >> debug_log.txt
	goto :end
)
setlocal EnableDelayedExpansion
for /f "tokens=3 delims=:" %%a in ('findstr /i "\"vite\"" package.json') do (
    set "vite_version=%%a"
    set "vite_version=!vite_version:~1,-2!"
)

if "!vite_version!"=="" (
  echo "Warning: vite dependency not found in package.json within ./myapp" >> debug_log.txt
)
endlocal

chdir "%~dp0"
echo Vite version (from package.json): %vite_version% >> debug_log.txt

REM --- Call startwebsite.bat (with full path) ---
echo. >> debug_log.txt
echo --- Calling startwebsite.bat --- >> debug_log.txt
call "%~dp0startwebsite.bat" >> debug_log.txt 2>&1
if errorlevel 1 (
     echo Error: startwebsite.bat returned an error. >> debug_log.txt
     goto :end_with_error
)
echo startwebsite.bat completed. >> debug_log.txt

goto :end

:end_with_error
echo. >> debug_log.txt
echo Errors found. >> debug_log.txt
exit /b 1

:end
echo. >> debug_log.txt
echo Script completed. >> debug_log.txt
exit /b 0
