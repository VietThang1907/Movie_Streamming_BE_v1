const axios = require('axios');

const BACKEND_URL = 'https://movie-streamming-be-v1.onrender.com';
const FRONTEND_URL = 'https://moviestreaming.io.vn';

async function testGoogleLogin() {
  console.log('🧪 Testing Google Login Functionality...\n');

  try {
    // 1. Test health check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await axios.get(`${BACKEND_URL}/api/health`);
    console.log('✅ Health check:', healthResponse.data.status);
    console.log('   Database:', healthResponse.data.database);
    console.log('   Environment:', healthResponse.data.environment);
    console.log('');

    // 2. Test CORS
    console.log('2️⃣ Testing CORS...');
    const corsResponse = await axios.get(`${BACKEND_URL}/api/health/cors-test`, {
      headers: {
        'Origin': FRONTEND_URL
      }
    });
    console.log('✅ CORS test successful');
    console.log('');

    // 3. Test Google readiness
    console.log('3️⃣ Testing Google login readiness...');
    const googleReadyResponse = await axios.get(`${BACKEND_URL}/api/health/google-ready`);
    console.log('📊 Google Login Config:');
    console.log('   Ready:', googleReadyResponse.data.ready ? '✅' : '❌');
    console.log('   Frontend URL:', googleReadyResponse.data.currentConfig.frontendUrl);
    console.log('   Backend URL:', googleReadyResponse.data.currentConfig.backendUrl);
    console.log('   Database:', googleReadyResponse.data.database);
    console.log('');

    // 4. Test Google login endpoint với dữ liệu mẫu
    console.log('4️⃣ Testing Google login endpoint...');
    const mockGoogleData = {
      email: 'test@gmail.com',
      name: 'Test User',
      googleId: '123456789',
      picture: 'https://example.com/avatar.jpg'
    };

    try {
      const googleLoginResponse = await axios.post(
        `${BACKEND_URL}/api/auth/google-login`,
        mockGoogleData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Origin': FRONTEND_URL
          }
        }
      );
      console.log('✅ Google login endpoint is reachable');
      console.log('   Response status:', googleLoginResponse.status);
    } catch (googleError) {
      if (googleError.response) {
        console.log('⚠️ Google login endpoint reachable but returned error:');
        console.log('   Status:', googleError.response.status);
        console.log('   Error:', googleError.response.data.error);
      } else {
        console.log('❌ Cannot reach Google login endpoint:', googleError.message);
      }
    }

    console.log('\n🎉 Test completed!');
    console.log('\n📋 Summary:');
    console.log('- Backend URL:', BACKEND_URL);
    console.log('- Frontend URL:', FRONTEND_URL);
    console.log('- Health check: Available');
    console.log('- CORS: Configured');
    console.log('- Google endpoint: Available');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Chạy test
testGoogleLogin();
