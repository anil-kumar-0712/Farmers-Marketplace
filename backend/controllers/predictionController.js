const Prediction = require('../models/Prediction');
const axios = require('axios');

// @desc    Predict demand and save result
// @route   POST /api/predict
// @access  Private
exports.predictDemand = async (req, res, next) => {
    try {
        const { cropType, month, previousSales } = req.body;

        // Simulated ML logic (from frontend)
        const baseDemand = { Wheat: 1200, Rice: 1500, Corn: 800, Tomato: 600, Potato: 900, Onion: 500 }[cropType] || 700;
        const monthFactor = [0.8, 0.85, 1.0, 1.1, 1.2, 1.15, 1.0, 0.95, 1.05, 1.1, 1.15, 1.3][month - 1];
        const salesFactor = previousSales > 0 ? (previousSales * 1.05) : 0;
        const predictedDemand = Math.round(baseDemand * monthFactor * 0.6 + salesFactor * 0.4);

        let suggestion = '';
        if (predictedDemand > 1000) {
            suggestion = 'High Demand – Increase Production. Consider scaling up and stocking inventory.';
        } else if (predictedDemand > 500) {
            suggestion = 'Moderate Demand – Plan production accordingly and maintain steady supply.';
        } else {
            suggestion = 'Low Demand – Reduce Supply. Focus on storage and alternative markets.';
        }

        // Call Gemini AI for a comprehensive demand prediction and analysis
        let aiAnalysis = "";
        const API_KEY = process.env.GEMINI_API_KEY;

        if (API_KEY) {
            try {
                const prompt = `Act as an expert agricultural AI. Provide a CONCISE, DIRECT demand analysis for ${cropType} in month ${month} (1=Jan, 12=Dec).
Previous Sales: ${previousSales}. Estimated Demand: ${predictedDemand} units.

YOUR TASK:
1. One sentence summary of the demand outlook.
2. Bullet points for 2-3 key factors (e.g., season, weather, market).
3. One sentence final action recommendation.
NO introductory fluff. Be straight to the point.`;

                const aiRes = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
                    { contents: [{ parts: [{ text: prompt }] }] }
                );

                if (aiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                    aiAnalysis = aiRes.data.candidates[0].content.parts[0].text;
                }
            } catch (aiErr) {
                console.error('Gemini AI Fetch Error:', aiErr.response?.data || aiErr.message);
                aiAnalysis = "AI analysis is currently unavailable. Please try again later.";
            }
        }

        const prediction = await Prediction.create({
            user: req.user.id,
            cropType,
            month,
            previousSales,
            predictedDemand,
            suggestion,
            aiAnalysis // Saving it if the schema allows, or just sending it back
        });

        res.status(200).json({
            success: true,
            data: {
                ...prediction._doc,
                aiAnalysis: aiAnalysis || prediction.aiAnalysis
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get prediction history
// @route   GET /api/predict/history
// @access  Private
exports.getPredictionHistory = async (req, res, next) => {
    try {
        const history = await Prediction.find({ user: req.user.id }).sort('-createdAt');
        res.status(200).json({ success: true, count: history.length, data: history });
    } catch (err) {
        next(err);
    }
};
