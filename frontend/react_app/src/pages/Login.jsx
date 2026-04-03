import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('farmer');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const res = await login(email, password);

        if (res.success) {
            const userName = res.user?.name || 'User';
            setSuccess(`Welcome back, ${userName}!`);
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } else {
            setError(res.error);
        }
        setLoading(false);
    };

    return (
        <AuthLayout activeTab="login" onTabChange={(tab) => tab === 'register' && navigate('/register')}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '0.5rem' }}>Login</h1>
                <p style={{ color: 'var(--gray)' }}>Select your role and enter your credentials</p>
            </div>

            <div className="role-selector">
                {['farmer', 'buyer', 'admin'].map((r) => (
                    <button
                        key={r}
                        type="button"
                        className={`role-btn ${role === r ? 'active' : ''}`}
                        onClick={() => setRole(r)}
                    >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                ))}
            </div>

            {success && (
                <div style={{
                    background: '#ecfdf5',
                    color: '#065f46',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    border: '1px solid #a7f3d0'
                }}>
                    <CheckCircle size={18} />
                    {success}
                </div>
            )}

            {error && (
                <div style={{
                    background: '#fef2f2',
                    color: '#991b1b',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    border: '1px solid #fecaca'
                }}>
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="input-label">Email Address</label>
                    <div className="input-wrapper">
                        <Mail className="input-icon" size={18} />
                        <input
                            type="email"
                            required
                            className="auth-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                        />
                    </div>
                </div>

                <div className="input-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label className="input-label" style={{ marginBottom: 0 }}>Password</label>
                        <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="input-wrapper">
                        <Lock className="input-icon" size={18} />
                        <input
                            type="password"
                            required
                            className="auth-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <input type="checkbox" id="remember" style={{ cursor: 'pointer' }} />
                    <label htmlFor="remember" style={{ fontSize: '0.9rem', color: 'var(--gray)', cursor: 'pointer' }}>Remember Me</label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    {loading ? 'Signing in...' : 'LOGIN'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray)' }}>
                New Here? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>Create an Account</Link>
            </p>
        </AuthLayout>
    );
};

export default Login;
