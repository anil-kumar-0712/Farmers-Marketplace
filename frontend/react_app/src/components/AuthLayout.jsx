import Hero3D from './Hero3D';
import { Leaf, CheckCircle } from 'lucide-react';

const AuthLayout = ({ children, activeTab, onTabChange }) => {
    return (
        <div className="auth-container">
            {/* Left Side - Premium Sidebar with 3D */}
            <div className="auth-sidebar" style={{ background: 'var(--primary-dark)', overflow: 'hidden' }}>
                <Hero3D />
                <div className="auth-sidebar-overlay" style={{ background: 'linear-gradient(135deg, rgba(45,77,40,0.3) 0%, rgba(20,40,15,0.2) 100%)' }}></div>

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '520px' }}>
                    {/* Logo Card */}
                    <div className="sidebar-logo-card">
                        <Leaf size={32} style={{ color: 'var(--primary)' }} />
                        <div style={{ lineHeight: 1 }}>
                            <h1 style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '1px', color: 'var(--primary)' }}>FARMERS</h1>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>MARKETPLACE</h2>
                        </div>
                    </div>

                    {/* Content Card */}
                    <div className="sidebar-floating-card">
                        <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1.5rem', lineHeight: 1.1, textTransform: 'uppercase' }}>
                            FRESH FROM<br />THE SOURCE.
                        </h2>
                        <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '2.5rem', opacity: 0.9 }}>
                            Join thousands of farmers and buyers connecting directly for a sustainable future.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem 2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700', fontSize: '0.95rem' }}>
                                <div style={{ background: 'white', borderRadius: '50%', padding: '4px', display: 'flex', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}><CheckCircle size={14} color="#2d4d28" /></div>
                                Direct Sales
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700', fontSize: '0.95rem' }}>
                                <div style={{ background: 'white', borderRadius: '50%', padding: '4px', display: 'flex', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}><CheckCircle size={14} color="#2d4d28" /></div>
                                AI Predictions
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700', fontSize: '0.95rem' }}>
                                <div style={{ background: 'white', borderRadius: '50%', padding: '4px', display: 'flex', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}><CheckCircle size={14} color="#2d4d28" /></div>
                                Fair Pricing
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700', fontSize: '0.95rem' }}>
                                <div style={{ background: 'white', borderRadius: '50%', padding: '4px', display: 'flex', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}><CheckCircle size={14} color="#2d4d28" /></div>
                                Verified Quality
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Premium Forms */}
            <div className="auth-content">
                <div className="auth-card fade-in">
                    <div className="auth-tabs">
                        <div
                            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                            onClick={() => onTabChange && onTabChange('login')}
                        >
                            SIGN IN
                        </div>
                        <div
                            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
                            onClick={() => onTabChange && onTabChange('register')}
                        >
                            REGISTER
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
