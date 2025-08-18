import { io as Client } from 'socket.io-client';
import fetch from 'node-fetch';

const SERVER_URL = 'http://localhost:3001';

async function testHTTPEndpoint() {
    console.log('\n🧪 Testing HTTP Health Endpoint...');
    try {
        const response = await fetch(`${SERVER_URL}/api/health`);
        const data = await response.json();
        console.log('✅ Health endpoint test passed:', data);
        return true;
    } catch (error) {
        console.log('❌ Health endpoint test failed:', error.message);
        return false;
    }
}

async function testSocketIO() {
    console.log('\n🧪 Testing Socket.IO Connection...');
    
    return new Promise((resolve) => {
        const socket = Client(SERVER_URL);
        
        socket.on('connect', () => {
            console.log('✅ Socket.IO connection successful. ID:', socket.id);
            
            // Test join-game event
            const testGameId = 'test-game-' + Date.now();
            socket.emit('join-game', testGameId);
            console.log(`📡 Emitted join-game event with gameId: ${testGameId}`);
            
            // Wait a bit then disconnect
            setTimeout(() => {
                socket.disconnect();
                console.log('🔌 Socket disconnected');
                resolve(true);
            }, 1000);
        });
        
        socket.on('connect_error', (error) => {
            console.log('❌ Socket.IO connection failed:', error.message);
            resolve(false);
        });
        
        socket.on('disconnect', () => {
            console.log('ℹ️ Socket disconnected');
        });
    });
}

async function runAllTests() {
    console.log('🚀 Starting server tests...\n');
    
    const httpTest = await testHTTPEndpoint();
    const socketTest = await testSocketIO();
    
    console.log('\n📊 Test Results:');
    console.log(`HTTP API: ${httpTest ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Socket.IO: ${socketTest ? '✅ PASS' : '❌ FAIL'}`);
    
    if (httpTest && socketTest) {
        console.log('\n🎉 All tests passed! Server is working correctly.');
    } else {
        console.log('\n⚠️ Some tests failed. Check server logs for details.');
    }
    
    process.exit(0);
}

// Run tests
runAllTests().catch(console.error);
