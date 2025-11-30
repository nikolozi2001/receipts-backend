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
    
    // Test 5: Check firewall/iptables
    console.log('\n5. Checking firewall status...');
    try {
      const { stdout: iptables } = await execAsync('iptables -L -n | grep 3001 || echo "No iptables rules found for port 3001"');
      console.log('iptables rules for port 3001:');
      console.log(iptables);
    } catch (error) {
      console.log('Could not check iptables (may need sudo)');
    }
    
    // Test 6: Network interface info
    console.log('\n6. Network interface information...');
    try {
      const { stdout: interfaces } = await execAsync('ip addr show || ifconfig');
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

1. From the server (192.168.3.3), test:
   curl http://localhost:3001/health
   curl http://127.0.0.1:3001/health  
   curl http://192.168.3.3:3001/health

2. From another PC on the network:
   curl http://192.168.3.3:3001/health
   
3. Check firewall settings:
   sudo ufw status (Ubuntu/Debian)
   sudo firewall-cmd --list-ports (CentOS/RHEL)
   
4. Open port 3001 if needed:
   sudo ufw allow 3001 (Ubuntu/Debian)
   sudo firewall-cmd --add-port=3001/tcp --permanent && sudo firewall-cmd --reload (CentOS/RHEL)

5. If using cloud server, check security groups/firewall rules in your cloud provider

🔧 Common Issues:
================
- Firewall blocking port 3001
- Cloud security groups not allowing inbound traffic
- Router/network firewall blocking internal traffic
- SELinux blocking network connections (on RHEL/CentOS)
`);

testConnectivity();