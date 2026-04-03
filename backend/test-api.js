const axios = require('axios');

const test = async () => {
    try {
        console.log('Testing Registration...');
        const regRes = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Test User',
            email: 'test' + Date.now() + '@example.com',
            password: 'password123',
            role: 'farmer',
            mobile: '1234567890'
        });
        console.log('Registration Success:', regRes.data.success);

        console.log('Testing Login...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: regRes.data.user.email,
            password: 'password123'
        });
        console.log('Login Success:', loginRes.data.success);
        console.log('Token Received:', !!loginRes.data.token);

    } catch (err) {
        console.error('Test Failed!');
        console.error('Status:', err.response?.status);
        console.error('Error:', err.response?.data?.error || err.message);
    }
};

test();
