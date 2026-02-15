@echo off
:: Скрипт для запуска NeuroSpark без ограничений
:: Отключает все сетевые проверки, лимиты на AI и облачный прокси

echo Устанавливаю переменные окружения для отключения ограничений...
set WAVETERM_NOLIMITS=1
set WAVETERM_NONETWORKCHECK=1
set WAVETERM_NOPING=1
set WAVETERM_DISABLE_CLOUD_AI=1
set WAVETERM_AI_PROXY_URL=disabled

echo Запускаю NeuroSpark...
.\dist\bin\wavesrv.x64.exe

pause