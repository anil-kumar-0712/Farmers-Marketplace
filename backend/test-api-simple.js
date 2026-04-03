const http = require('http');

const post = (path, data) => {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(data);
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': body.length
            }
        }, (res) => {
            let resBody = '';
            res.on('data', chunk => resBody += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(resBody) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: resBody });
                }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
};

const test = async () => {
    try {
        console.log('Testing Registration...');
        const email = 'test' + Date.now() + '@example.com';
        const reg = await post('/api/auth/register', {
            name: 'Test User',
            email: email,
            password: 'password123',
            role: 'farmer',
            mobile: '1234567890'
        });
        console.log('Registration Status:', reg.status);
        console.log('Registration Data:', reg.data);

        if (reg.status === 201) {
            console.log('Testing Login...');
            const login = await post('/api/auth/login', {
                email: email,
                password: 'password123'
            });
            console.log('Login Status:', login.status);
            console.log('Login Data:', login.data);
        }
    } catch (err) {
        console.error('Test Failed:', err.message);
    }
};

test();
