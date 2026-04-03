require('dotenv').config();
const axios = require('axios');

const testGemini = async () => {
    const API_KEY = process.env.GEMINI_API_KEY;
    const model = 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

    console.log('Testing Gemini API...');
    console.log('Model:', model);
    console.log('API Key:', API_KEY ? (API_KEY.substring(0, 5) + '...') : 'MISSING');

    try {
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: 'Say hello!' }] }]
        });
        console.log('SUCCESS!');
        console.log('Response:', response.data.candidates[0].content.parts[0].text);
    } catch (error) {
        console.error('FAILED!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
};

testGemini();
