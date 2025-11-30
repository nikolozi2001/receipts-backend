@echo off
echo ====================================
echo Windows Server Network Diagnostics
echo ====================================
echo.

echo 1. Checking if Node.js process is running on port 3001...
netstat -ano | findstr :3001
echo.

echo 2. Testing local connectivity...
echo Trying localhost...
curl -s http://localhost:3001/health 2>nul && echo SUCCESS: localhost works || echo FAILED: localhost not accessible

echo Trying 127.0.0.1...
curl -s http://127.0.0.1:3001/health 2>nul && echo SUCCESS: 127.0.0.1 works || echo FAILED: 127.0.0.1 not accessible

echo Trying server IP 192.168.3.3...
curl -s http://192.168.3.3:3001/health 2>nul && echo SUCCESS: 192.168.3.3 works || echo FAILED: 192.168.3.3 not accessible
echo.

echo 3. Testing connectivity with PowerShell...
powershell -Command "try { Invoke-WebRequest -Uri 'http://192.168.3.3:3001/health' -TimeoutSec 5 | Select-Object StatusCode, StatusDescription } catch { Write-Host 'PowerShell test failed:' $_.Exception.Message }"
echo.

echo 4. Testing port connectivity...
powershell -Command "Test-NetConnection -ComputerName 192.168.3.3 -Port 3001"
echo.

echo 5. Checking Windows Firewall rules for port 3001...
powershell -Command "Get-NetFirewallRule | Where-Object {$_.DisplayName -like '*3001*'} | Select-Object DisplayName, Enabled, Direction, Action"
echo.

echo 6. Checking network profile...
powershell -Command "Get-NetConnectionProfile | Select-Object Name, InterfaceAlias, NetworkCategory"
echo.

echo 7. Checking if Windows Defender Firewall is blocking...
netsh advfirewall show allprofiles state
echo.

echo 8. Network interface information...
ipconfig /all | findstr /i "IPv4\|Adapter\|Subnet"
echo.

echo ====================================
echo Manual tests to try:
echo ====================================
echo From this server:
echo   curl http://192.168.3.3:3001/test
echo   curl http://192.168.3.3:3001/network-info
echo.
echo From another PC:
echo   Open browser: http://192.168.3.3:3001/test
echo   Command: curl http://192.168.3.3:3001/test
echo.
echo If still not working, try:
echo   1. Temporarily disable Windows Defender Firewall
echo   2. Check antivirus software
echo   3. Restart the Node.js service
echo   4. Check router/switch settings
echo ====================================

pause