import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Newspaper, ExternalLink, Clock, RefreshCw, AlertTriangle } from 'lucide-react';

const AgriNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNews = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch via our new backend proxy to bypass CORS
            const res = await axios.get('/api/news/agri');

            if (res.data.status === 'ok') {
                setNews(res.data.items.slice(0, 8));
            } else {
                throw new Error('News service returned an error status');
            }
        } catch (err) {
            console.error('News Fetch Error:', err);
            setError('Could not sync with the field. Please check your connection.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.4)' }}>
            <div style={{
                padding: '1.2rem',
                background: 'rgba(255,255,255,0.2)',
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backdropFilter: 'blur(5px)'
            }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#1a3c1b' }}>
                    <div style={{ background: '#274d28', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                        <Newspaper size={18} color="white" />
                    </div>
                    LIVE AGRICULTURE NEWS
                </h3>
                <button
                    onClick={(e) => { e.preventDefault(); fetchNews(); }}
                    disabled={loading}
                    style={{
                        all: 'unset',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: '#274d28',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: 'rgba(39, 77, 40, 0.1)',
                        transition: 'all 0.2s ease',
                        opacity: loading ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(39, 77, 40, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(39, 77, 40, 0.1)'}
                >
                    <RefreshCw size={14} className={loading ? 'spin' : ''} />
                    {loading ? 'Syncing...' : 'Refresh'}
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem' }} className="custom-scrollbar">
                {loading && news.length === 0 ? (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--gray)', gap: '1rem' }}>
                        <RefreshCw size={32} className="spin" color="var(--primary)" />
                        <span style={{ fontStyle: 'italic', fontWeight: '500' }}>Harvesting latest updates...</span>
                    </div>
                ) : error ? (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', color: '#c0392b', gap: '1rem' }}>
                        <AlertTriangle size={40} />
                        <p style={{ fontWeight: '600' }}>{error}</p>
                        <button onClick={fetchNews} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: '20px' }}>Try Again</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        {news.map((item, index) => (
                            <div key={index} style={{
                                padding: '1.2rem',
                                background: 'rgba(255,255,255,0.4)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.3)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer'
                            }}
                                className="news-card"
                                onClick={() => window.open(item.link, '_blank')}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', alignItems: 'center' }}>
                                    <div style={{
                                        fontSize: '0.65rem',
                                        color: 'white',
                                        fontWeight: '800',
                                        background: '#274d28',
                                        padding: '2px 10px',
                                        borderRadius: '20px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {item.categories?.[0] || 'INDIA AGRI'}
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--gray)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <Clock size={12} /> {new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(item.pubDate))}
                                    </span>
                                </div>
                                <h4 style={{ fontSize: '1rem', fontWeight: '750', marginBottom: '0.8rem', lineHeight: '1.4', color: '#1a1a1a' }}>
                                    {item.title.split(' - ')[0]}
                                </h4>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.4rem', color: '#274d28', fontSize: '0.8rem', fontWeight: '800' }}>
                                    SOURCE: {item.title.split(' - ').slice(-1)[0] || 'News'} <ExternalLink size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(39, 77, 40, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(39, 77, 40, 0.4); }
                
                .news-card:hover { 
                    transform: translateX(5px); 
                    background: rgba(255,255,255,0.75) !important;
                    border-color: rgba(39, 77, 40, 0.3) !important;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                }
                
                @keyframes spin { 
                    from { transform: rotate(0deg); } 
                    to { transform: rotate(360deg); } 
                }
                .spin { animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
            `}} />
        </div>
    );
};

export default AgriNews;
