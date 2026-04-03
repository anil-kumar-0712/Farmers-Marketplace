import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { verifyOTP } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get email from navigation state
    const email = location.state?.email || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Email is missing. Please try registering again.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const res = await verifyOTP(email, otp);
        if (res.success) {
            setSuccess('Verification successful! Welcome to Farmers Marketplace.');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } else {
            setError(res.error || 'Invalid verification code. Please try again.');
        }
        setLoading(false);
    };

    return (
        <AuthLayout activeTab="register" onTabChange={(tab) => tab === 'login' && navigate('/login')}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--dark)', letterSpacing: '-0.5px' }}>
                    Verify Your Email
                </h2>
                <p style={{ color: 'var(--gray)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    We've sent a 6-digit verification code to <span style={{ fontWeight: '700', color: 'var(--dark)' }}>{email || 'your email'}</span>.
                    Please enter it below to complete your registration.
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="input-group">
                    <label className="input-label">Verification Code</label>
                    <div className="input-wrapper">
                        <ShieldCheck className="input-icon" size={18} />
                        <input
                            type="text"
                            maxLength="6"
                            className="auth-input"
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            style={{ letterSpacing: '4px', fontSize: '1.2rem', fontWeight: '700', textAlign: 'center' }}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !otp}
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                        padding: '1.2rem',
                        borderRadius: 'var(--radius-sm)',
                        marginTop: '2rem',
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        cursor: (loading || !otp) ? 'not-allowed' : 'pointer',
                        boxShadow: 'var(--shadow-md)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {loading ? 'Verifying...' : 'VERIFY CODE'}
                </button>

                {error && (
                    <div className="error-msg fade-in" style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        background: '#fef2f2',
                        border: '1.5px solid #fee2e2',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: '#991b1b',
                        fontSize: '0.88rem',
                        fontWeight: '600'
                    }}>
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                {success && (
                    <div className="success-msg fade-in" style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        background: '#f0fdf4',
                        border: '1.5px solid #dcfce7',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: '#166534',
                        fontSize: '0.88rem',
                        fontWeight: '600'
                    }}>
                        <CheckCircle size={18} /> {success}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => navigate('/register')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--gray)',
                        marginTop: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}
                >
                    <ArrowLeft size={16} /> Back to Registration
                </button>
            </form>
        </AuthLayout>
    );
};

export default VerifyOTP;
