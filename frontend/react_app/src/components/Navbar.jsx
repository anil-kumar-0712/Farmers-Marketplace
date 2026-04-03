import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Bell, Search, Menu } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-card" style={{
            position: 'sticky',
            top: '1rem',
            margin: '1rem',
            padding: '0.8rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 100,
            background: 'rgba(255, 255, 255, 0.9)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--primary)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '900',
                    fontSize: '1.2rem'
                }}>C</div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--dark)' }}>CropPredict</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: '#f0f2f5',
                    borderRadius: '20px',
                    color: 'var(--gray)'
                }}>
                    <Search size={16} />
                    <input placeholder="Search..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid #ddd', paddingLeft: '1.5rem' }}>
                    <Bell size={20} style={{ color: 'var(--gray)', cursor: 'pointer' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '-4px' }}>{user?.name}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--gray)', textTransform: 'capitalize' }}>{user?.role}</p>
                        </div>
                        <div
                            onClick={() => navigate('/profile')}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#eee',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid var(--primary)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <User size={20} color="var(--primary)" />
                        </div>
                        <button onClick={handleLogout} style={{ background: 'transparent', color: 'var(--danger)', padding: '0.5rem' }}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
