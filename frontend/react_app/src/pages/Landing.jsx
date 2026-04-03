import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, Leaf, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

const Landing = () => {
    const { user, login, register, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const containerRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline();

        // Hero Content Animation
        tl.from('.hero-badge', { y: -50, opacity: 0, duration: 0.8, ease: 'back.out' })
            .from('.hero-title', { x: -100, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
            .from('.hero-subtitle', { x: -50, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
            .from('.feature-item', { scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' }, '-=0.4')

        // Auth Card entrance
        gsap.from('.auth-card', {
            scale: 0.9,
            opacity: 0,
            duration: 1,
            delay: 0.5,
            ease: 'power4.out',
            clearProps: 'all'
        });
    }, { scope: containerRef });

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [regData, setRegData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'farmer',
        mobile: ''
    });

    if (authLoading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading Application...</div>;

    // If already logged in, redirect to dashboard
    if (user) return <Navigate to="/dashboard" replace />;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const res = await login(email, password);
        if (res.success) {
            setSuccess(`Welcome back! Redirecting...`);
            setTimeout(() => navigate('/dashboard'), 1000);
        } else {
            setError(res.error);
        }
        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const res = await register(regData);
        if (res.success) {
            setSuccess('Account created! Please login.');
            setIsLogin(true);
            setEmail(regData.email);
        } else {
            setError(res.error);
        }
        setLoading(false);
    };

    return (
        <div className="auth-container" ref={containerRef}>
            {/* Left Side: Brand & Marketing */}
            <div className="auth-sidebar">
                <img
                    src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                    alt="Farm Background"
                    className="auth-sidebar-bg"
                />
                <div className="auth-sidebar-overlay"></div>

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '500px' }}>
                    <div className="glass-card hero-badge" style={{ padding: '2rem', color: 'var(--primary)', display: 'inline-block', marginBottom: '2rem', background: 'rgba(255,255,255,0.95)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Leaf size={40} />
                            <div style={{ lineHeight: 1 }}>
                                <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '2px' }}>FARMERS</h1>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>MARKETPLACE</h2>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card hero-title" style={{ padding: '3rem', color: 'var(--dark)', background: 'rgba(255,255,255,0.95)' }}>
                        <h2 className="hero-title" style={{ fontSize: '2.8rem', fontWeight: '900', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                            FRESH FROM <br /> THE SOURCE.
                        </h2>
                        <p className="hero-subtitle" style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '2rem', color: 'var(--gray)' }}>
                            Join thousands of farmers and buyers connecting directly for a sustainable future.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="feature-item"><FeatureItem icon={<CheckCircle size={18} />} text="Direct Sales" /></div>
                            <div className="feature-item"><FeatureItem icon={<CheckCircle size={18} />} text="AI Predictions" /></div>
                            <div className="feature-item"><FeatureItem icon={<CheckCircle size={18} />} text="₹ Fair Pricing" /></div>
                            <div className="feature-item"><FeatureItem icon={<CheckCircle size={18} />} text="Verified Quality" /></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Forms */}
            <div className="auth-content">
                <div className="auth-card fade-in">
                    <div className="auth-tabs" style={{ marginBottom: '3rem' }}>
                        <div
                            className={`auth-tab ${isLogin ? 'active' : ''}`}
                            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                        >
                            SIGN IN
                        </div>
                        <div
                            className={`auth-tab ${!isLogin ? 'active' : ''}`}
                            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                        >
                            REGISTER
                        </div>
                    </div>

                    {error && (
                        <div style={{ padding: '1rem', background: '#fef2f2', color: '#991b1b', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #fecaca', fontSize: '0.9rem' }}>
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    {success && (
                        <div style={{ padding: '1rem', background: '#f0fdf4', color: '#166534', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #bbf7d0', fontSize: '0.9rem' }}>
                            <CheckCircle size={18} /> {success}
                        </div>
                    )}

                    {isLogin ? (
                        <form onSubmit={handleLogin} className="fade-in">
                            <h2 style={{ marginBottom: '2rem', fontWeight: '800' }}>Welcome Back</h2>
                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <div className="input-wrapper">
                                    <Mail className="input-icon" size={18} />
                                    <input
                                        type="email" required className="auth-input" placeholder="name@farm.com"
                                        value={email} onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={18} />
                                    <input
                                        type="password" required className="auth-input" placeholder="••••••••"
                                        value={password} onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem', justifyContent: 'center' }}>
                                {loading ? 'Checking...' : 'SIGN IN'} <ArrowRight size={18} />
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="fade-in">
                            <h2 style={{ marginBottom: '2rem', fontWeight: '800' }}>Create Account</h2>
                            <div className="input-group">
                                <label className="input-label">Full Name</label>
                                <div className="input-wrapper">
                                    <User className="input-icon" size={18} />
                                    <input
                                        type="text" required className="auth-input" placeholder="John Farmer"
                                        value={regData.name} onChange={e => setRegData({ ...regData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <div className="input-wrapper">
                                    <Mail className="input-icon" size={18} />
                                    <input
                                        type="email" required className="auth-input" placeholder="john@example.com"
                                        value={regData.email} onChange={e => setRegData({ ...regData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Role</label>
                                    <select
                                        className="auth-input" style={{ paddingLeft: '1rem' }}
                                        value={regData.role} onChange={e => setRegData({ ...regData, role: e.target.value })}
                                    >
                                        <option value="farmer">Farmer</option>
                                        <option value="buyer">Buyer</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Mobile</label>
                                    <div className="input-wrapper">
                                        <Phone className="input-icon" size={18} />
                                        <input
                                            type="text" required className="auth-input" placeholder="1234567890"
                                            value={regData.mobile} onChange={e => setRegData({ ...regData, mobile: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Secure Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={18} />
                                    <input
                                        type="password" required className="auth-input" placeholder="••••••••"
                                        value={regData.password} onChange={e => setRegData({ ...regData, password: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem', justifyContent: 'center' }}>
                                {loading ? 'Creating...' : 'REGISTER NOW'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

const FeatureItem = ({ icon, text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--gray)', fontSize: '0.9rem', fontWeight: '700' }}>
        <div style={{ color: 'var(--primary)' }}>{icon}</div>
        <span>{text}</span>
    </div>
);

export default Landing;
