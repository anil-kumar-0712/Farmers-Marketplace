import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Phone, Calendar } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return <div className="container">Loading Profile...</div>;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="container fade-in" style={{ paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Your Account</h1>
                <p style={{ color: 'var(--gray)' }}>View and manage your personal information</p>
            </header>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="glass-card" style={{ padding: '3rem', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'var(--primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '4px solid var(--primary)',
                        color: 'var(--primary)',
                        marginBottom: '1rem'
                    }}>
                        <User size={64} />
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>{user.name}</h2>
                        <span style={{
                            padding: '0.3rem 1rem',
                            borderRadius: '20px',
                            background: user.role === 'farmer' ? '#e8f5e9' : '#e3f2fd',
                            color: user.role === 'farmer' ? '#2e7d32' : '#1565c0',
                            fontSize: '0.9rem',
                            fontWeight: '700',
                            textTransform: 'uppercase'
                        }}>{user.role}</span>
                    </div>

                    <div style={{
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginTop: '1rem'
                    }}>
                        <InfoItem icon={<Mail size={20} />} label="Email Address" value={user.email} />
                        {user.mobile && <InfoItem icon={<Phone size={20} />} label="Mobile Number" value={user.mobile} />}
                        <InfoItem icon={<Shield size={20} />} label="Account Status" value={user.status || 'Active'} />
                        <InfoItem icon={<Calendar size={20} />} label="Member Since" value={formatDate(user.createdAt)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', borderRadius: '12px', background: '#f8fafc' }}>
        <div style={{ color: 'var(--primary)', marginTop: '2px' }}>{icon}</div>
        <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: '600', marginBottom: '2px' }}>{label}</p>
            <p style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--dark)' }}>{value}</p>
        </div>
    </div>
);

export default Profile;
