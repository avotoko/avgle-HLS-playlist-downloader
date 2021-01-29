@echo off
@setlocal
if /%1/==// (
	echo Please drag and drop the m3u8 file downloaded using avgleHPD onto this %~nx0 icon. 
	goto :onexit
)
set dir=%~dp1%
set name=%~n1%
where powershell | find "powershell" > nul
if not "%errorlevel%"=="0" (
	echo Error: powershell not found.
	goto :onexit
)
where streamlink | find "streamlink" > nul
if not "%errorlevel%"=="0" (
	echo Error: streamlink not found.
	goto :onexit
)
set url=%~dpnx1
for /f "usebackq" %%a in (`powershell ^([system.uri]'%url%'^).AbsoluteUri`) do set url=%%a
set TempName=avgle-%date:/=%-%time::=%
set TempName=%TempName:.=%
set TempTsFile=%dir%%TempName%.ts
set OutTsFile=%dir%%name%.ts
echo on
streamlink --http-header referer=https://avgle.com/ %url% best -o "%TempTsFile%"
@echo off
set TempMp4File=%dir%%TempName%.mp4
set OutMp4File=%dir%%name%.mp4
where ffmpeg | find "ffmpeg" > nul
if "%errorlevel%"=="0" (
	echo on
	ffmpeg -i "%TempTsFile%" -c copy "%TempMp4File%"
	move "%TempMp4File%" "%OutMp4File%"
	if exist "%OutMp4File%" del "%TempTsFile%"
) else (
	ren "%TempTsFile%" "%OutTsFile%"
)
@echo off
goto :onexit
:onexit
echo.
set /p dummy="Hit [Enter] key to exit: "
goto :eof


