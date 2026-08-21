(for /r %%i in (*.tsx *.ts) do @(echo ### File: %%~pnxi & echo ```tsx & type "%%i" & echo. & echo ``` & echo.)) > semua_kode.md
