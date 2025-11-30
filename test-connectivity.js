#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fetch from 'node-fetch';

const execAsync = promisify(exec);

async function testConnectivity() {
  console.log('🔍 Testing API Connectivity...\n');
  
  try {
    // Test 1: Check if port is listening
    console.log('1. Checking if port 3001 is listening...');
    try {
      const { stdout } = await execAsync('netstat -an | grep :3001 || ss -tuln | grep :3001');
      console.log('✅ Port 3001 is listening:');
      console.log(stdout);
    } catch (error) {
      console.log('❌ Port 3001 is not listening or netstat/ss not available');
    }
    
    // Test 2: Check local connectivity
    console.log('\n2. Testing local connectivity...');
    try {
      const response = await fetch('http://localhost:3001/health', { timeout: 5000 });
      const data = await response.json();
      console.log('✅ Local access works:');
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      console.log('❌ Local access failed:', error.message);
    }
    
    // Test 3: Check 0.0.0.0 binding
    console.log('\n3. Testing 0.0.0.0 binding...');
    try {
      const response = await fetch('http://0.0.0.0:3001/health', { timeout: 5000 });
      const data = await response.json();
      console.log('✅ 0.0.0.0 binding works:');
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      console.log('❌ 0.0.0.0 binding failed:', error.message);
    }
    
    // Test 4: Check server IP binding
    console.log('\n4. Testing server IP (192.168.3.3) binding...');
    try {
      const response = await fetch('http://192.168.3.3:3001/health', { timeout: 5000 });
      const data = await response.json();
      console.log('✅ Server IP access works:');
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      console.log('❌ Server IP access failed:', error.message);
    }
    
    // Test 5: Check firewall/network status (Windows & Linux)
    console.log('\n5. Checking network status...');
    try {
      // Windows commands
      const { stdout: netstat } = await execAsync('netstat -ano | findstr :3001 || netstat -tuln | grep :3001 || echo "Port not found"');
      console.log('Port 3001 listening status:');
      console.log(netstat);
    } catch (error) {
      console.log('Could not check port status');
    }
    
    // Test 6: Network interface info (Windows & Linux)
    console.log('\n6. Network interface information...');
    try {
      const { stdout: interfaces } = await execAsync('ipconfig /all || ip addr show || ifconfig');
      console.log('Network interfaces:');
      console.log(interfaces);
    } catch (error) {
      console.log('Could not get network interface info');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Instructions for manual testing
console.log(`
📋 Manual Testing Instructions:
=====================================

1. From the Windows server (192.168.3.3), test in PowerShell:
   curl http://localhost:3001/health
   curl http://127.0.0.1:3001/health  
   curl http://192.168.3.3:3001/health
   
   Or use Invoke-WebRequest:
   Invoke-WebRequest -Uri "http://localhost:3001/health"
   Invoke-WebRequest -Uri "http://192.168.3.3:3001/health"

2. From another PC on the network:
   curl http://192.168.3.3:3001/health
   
   Or in browser: http://192.168.3.3:3001/health

3. Windows Firewall Commands:
   # Check if rule exists
   Get-NetFirewallRule -DisplayName "Allow Port 3001"
   
   # Check port is listening
   netstat -ano | findstr :3001
   
   # Test connectivity from server to itself
   Test-NetConnection -ComputerName 192.168.3.3 -Port 3001

4. If still not working, check Windows Defender Firewall:
   # Disable temporarily to test (re-enable after!)
   netsh advfirewall set allprofiles state off
   # Re-enable
   netsh advfirewall set allprofiles state on

🔧 Windows-Specific Issues:
==========================
- Windows Defender Firewall may have additional blocking
- Network profile (Public/Private/Domain) affects firewall rules
- Antivirus software may block network connections
- Windows Advanced Firewall may have conflicting rules
`);

testConnectivity();