@echo off
@setlocal
if /%1/==// (
	echo Please drag and drop the m3u8 file downloaded using avgleHPD onto this %~nx0 icon. 
	goto onexit
)
where powershell | find "powershell" > nul
if not "%errorlevel%"=="0" (
	echo Error: powershell is not available.
	goto onexit
)
where streamlink | find "streamlink" > nul
if not "%errorlevel%"=="0" (
	echo Error: streamlink is not available.
	goto onexit
)
echo Batch file argument %%1: %1
set PlaylistFile=%~dpnx1%
echo Playlist Path: %PlaylistFile%
set dir=%~dp1%
set name=%~n1%
for /f "usebackq" %%a in (`powershell -Command "Get-Date -format yyyyMMdd-HHmmssff"`) do set datetime=%%a
set TempName=avgle-%datetime%
echo TempName: %TempName%
set TempPlaylistFile=%dir%%TempName%.m3u8
echo on
copy "%PlaylistFile%" "%TempPlaylistFile%"
@echo off
if not exist "%TempPlaylistFile%" goto onexit
for /f "usebackq" %%a in (`powershell ^([system.uri]'%TempPlaylistFile%'^).AbsoluteUri`) do set url=%%a
if "%url%"=="" (
	echo Error: failed to convert "%TempPlaylistFile%" to URL
	goto onexit
)
set TempTsFile=%dir%%TempName%.ts
set OutTsFile=%dir%%name%.ts
echo on
streamlink --http-header referer=https://avgle.com/ %url% best -o "%TempTsFile%"
@echo off
if not exist "%TempTsFile%" goto onexit
set TempMp4File=%dir%%TempName%.mp4
set OutMp4File=%dir%%name%.mp4
where ffmpeg | find "ffmpeg" > nul
if not "%errorlevel%"=="0" goto noffmpeg
	echo on
	ffmpeg -hide_banner -i "%TempTsFile%" -c copy "%TempMp4File%"
	move "%TempMp4File%" "%OutMp4File%"
	if exist "%OutMp4File%" del "%TempTsFile%"
	@echo off
	goto onexit
:noffmpeg
	echo on
	move "%TempTsFile%" "%OutTsFile%"
	@echo off
	goto onexit
:onexit
if exist "%TempPlaylistFile%" del "%TempPlaylistFile%"
echo.
echo %~nx0% v.0.1.3
set /p dummy="Hit [Enter] key to exit: "
goto :eof
