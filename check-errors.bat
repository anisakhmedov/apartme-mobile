@echo off
cd D:\APARTME\mobile
npx tsc --noEmit --skipLibCheck
echo Exit code: %ERRORLEVEL%
pause