@echo off
cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;%PATH%
C:\PROGRA~1\nodejs\node.exe node_modules\next\dist\bin\next %*
