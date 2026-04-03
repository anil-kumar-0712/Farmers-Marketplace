require('dotenv').config();
const axios = require('axios');

const listModels = async () => {
    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        console.log('Available Models:');
        response.data.models.forEach(m => console.log(`- ${m.name}`));
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

listModels();
