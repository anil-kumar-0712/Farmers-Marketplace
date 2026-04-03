import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'farmer',

        mobile: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const res = await register(formData);
        if (res.success) {
            setSuccess('Registration successful! Sending verification code...');
            setTimeout(() => {
                navigate('/verify-otp', { state: { email: formData.email } });
            }, 1500);
        } else {
            setError(res.error || 'Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    return (
        <AuthLayout activeTab="register" onTabChange={(tab) => tab === 'login' && navigate('/login')}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2.5rem', color: 'var(--dark)', letterSpacing: '-0.5px' }}>
                Create Account
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <div className="input-wrapper">
                        <User className="input-icon" size={18} />
                        <input
                            type="text"
                            name="name"
                            className="auth-input"
                            placeholder="anil"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Email Address</label>
                    <div className="input-wrapper">
                        <Mail className="input-icon" size={18} />
                        <input
                            type="email"
                            name="email"
                            className="auth-input"
                            placeholder="anilrongali323@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="auth-info-grid" style={{ marginBottom: '1.5rem', gap: '1.25rem' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Role</label>
                        <select
                            name="role"
                            className="auth-input"
                            value={formData.role}
                            onChange={handleChange}
                            style={{ paddingLeft: '1rem' }}
                        >
                            <option value="farmer">Farmer</option>
                            <option value="buyer">Buyer</option>
                            <option value="admin">Admin</option>

                        </select>
                    </div>

                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Mobile</label>
                        <div className="input-wrapper">
                            <Phone className="input-icon" size={18} />
                            <input
                                type="text"
                                name="mobile"
                                className="auth-input"
                                placeholder="9676641698"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Secure Password</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" size={18} />
                        <input
                            type="password"
                            name="password"
                            className="auth-input"
                            placeholder="••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
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
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: 'var(--shadow-md)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {loading ? 'Processing...' : 'REGISTER NOW'}
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
                        fontWeight: '600',
                        boxShadow: 'var(--shadow-sm)'
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
                        fontWeight: '600',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <CheckCircle size={18} /> {success}
                    </div>
                )}

                <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--gray)', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Sign In</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Register;
