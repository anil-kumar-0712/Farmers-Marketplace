import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard3D from '../components/Dashboard3D';

import { BarChart3, TrendingUp, AlertCircle, Calendar, Hash } from 'lucide-react';

const PredictionPage = () => {
    const [formData, setFormData] = useState({ cropType: 'Wheat', month: 1, previousSales: '' });
    const [prediction, setPrediction] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Gemini Output State
    const [aiAnalysis, setAiAnalysis] = useState("");

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('/api/predict/history');
            setHistory(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAiAnalysis("");

        try {
            // Get base prediction and AI analysis from backend
            const res = await axios.post('/api/predict', formData);
            const predictionData = res.data.data;
            setPrediction(predictionData);
            setAiAnalysis(predictionData.aiAnalysis || "");
            fetchHistory();
        } catch (err) {
            console.error('Prediction Error:', err);
            const errMsg = err.response?.data?.error?.message || err.message || "Unknown error";
            alert(`Prediction failed.\nDetails: ${errMsg}`);
        }
        setLoading(false);
    };

    return (
        <>
            <Dashboard3D />
            <div className="container fade-in" style={{ paddingBottom: '3rem' }}>
                <header style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Demand Prediction</h1>
                    <p style={{ color: 'var(--gray)' }}>Get AI-driven insights for your harvest planning</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                    {/* Input Form */}
                    <section className="glass-card" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <BarChart3 size={20} color="var(--primary)" /> New Prediction
                        </h2>
                        <form onSubmit={handlePredict}>
                            <div style={{ marginBottom: '1.2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Crop Type</label>
                                <select value={formData.cropType} onChange={e => setFormData({ ...formData, cropType: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}>
                                    {['Wheat', 'Rice', 'Corn', 'Tomato', 'Potato', 'Onion'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div style={{ marginBottom: '1.2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Month of Harvest</label>
                                <select value={formData.month} onChange={e => setFormData({ ...formData, month: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}>
                                    {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
                                </select>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Previous Sales (Quantity)</label>
                                <div style={{ position: 'relative' }}>
                                    <Hash size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                                    <input type="number" required value={formData.previousSales} onChange={e => setFormData({ ...formData, previousSales: e.target.value })}
                                        placeholder="Ex: 500" style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                {loading ? 'Analyzing...' : 'Generate Prediction'}
                            </button>
                        </form>
                    </section>

                    {/* Result & Visuals */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {prediction && (
                            <section className="glass-card" style={{ padding: '2rem', background: 'var(--dark)', color: 'white' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Prediction Result</h2>
                                        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Based on seasonal trends and historical data</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '2rem', fontWeight: '800' }}>{prediction.predictedDemand}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>UNITS DEMANDED</div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
                                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                                        <TrendingUp size={24} color="var(--primary)" />
                                        <p style={{ fontSize: '1rem' }}>{prediction.suggestion}</p>
                                    </div>
                                </div>
                            </section>
                        )}

                        <section className="glass-card" style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <TrendingUp size={20} /> AI Demand Analysis
                            </h2>
                            <div style={{ flex: 1, overflowY: 'auto', background: '#f8f9fa', borderRadius: '8px', padding: '1.5rem', minHeight: '250px' }}>
                                {loading ? (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray)', fontStyle: 'italic' }}>
                                        Analyzing crop details and predicting demand...
                                    </div>
                                ) : aiAnalysis ? (
                                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#333', fontSize: '0.95rem' }}>
                                        {aiAnalysis}
                                    </div>
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray)' }}>
                                        Enter crop details and generate a prediction to see AI analysis here.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PredictionPage;
