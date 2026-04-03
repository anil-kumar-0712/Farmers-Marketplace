import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard3D from '../components/Dashboard3D';
import {
    Home, LayoutGrid, Calendar, Bell, Settings, LogOut,
    User as UserIcon, Shield, Activity, Database, CheckCircle,
    AlertCircle, TrendingUp, Users, MapPin, List, DollarSign, Package
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LineChart, Line, BarChart, Bar,
    Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const accuracyData = [
    { name: 'Jan', actual: 75, predicted: 80 },
    { name: 'Feb', actual: 85, predicted: 82 },
    { name: 'Mar', actual: 78, predicted: 85 },
    { name: 'Apr', actual: 95, predicted: 90 },
    { name: 'May', actual: 90, predicted: 92 },
];

const activityData = [
    { name: 'Jan', value: 18 },
    { name: 'Feb', value: 20 },
    { name: 'Mar', value: 25 },
    { name: 'Apr', value: 22 },
    { name: 'May', value: 28 },
];

const ratingData = [
    { name: 'Jan', value: 20 },
    { name: 'Feb', value: 11 },
    { name: 'Farm', value: 5 },
    { name: 'Buyer', value: 1 },
];

const registrationData = [
    { name: 'Jan', admins: 100, farmers: 300, buyers: 50 },
    { name: 'Feb', admins: 200, farmers: 450, buyers: 150 },
    { name: 'Mar', admins: 400, farmers: 600, buyers: 300 },
    { name: 'Apr', admins: 600, farmers: 850, buyers: 450 },
    { name: 'May', admins: 1200, farmers: 1000, buyers: 550 },
];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading Admin Control Center...</div>;

    return (
        <>
            <Dashboard3D />
            <div className="dashboard-layout fade-in">
                {/* Sidebar */}
                <aside className="dashboard-sidebar">
                    <div className="sidebar-icon active" onClick={() => navigate('/admin')} title="Home"><Home size={22} /></div>
                    <div className="sidebar-icon" title="Analytics"><LayoutGrid size={22} /></div>
                    <div className="sidebar-icon" title="Calendar"><Calendar size={22} /></div>
                    <div className="sidebar-icon" title="Settings"><Settings size={22} /></div>
                    <div style={{ marginTop: 'auto' }} className="sidebar-icon" onClick={logout} title="Logout"><LogOut size={22} /></div>
                </aside>

                {/* Main Content */}
                <main className="dashboard-main">
                    {/* Top Header */}
                    <header className="dashboard-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <h1 style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.5px' }}>FARMER MARKETPLACE & DEMAND PREDICTION</h1>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--gray)' }}>
                            <UserIcon size={24} style={{ cursor: 'pointer', background: '#e5e7eb', padding: '4px', borderRadius: '50%' }} />
                            <Bell size={20} style={{ cursor: 'pointer' }} />
                            <Settings size={20} style={{ cursor: 'pointer' }} />
                        </div>
                    </header>

                    <div style={{ padding: '1.5rem 0' }}>
                        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '2rem' }}>
                            Farmer Dashboard Platform Administration & System Monitoring Dashboard
                        </h1>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1.5rem' }}>

                            {/* Column 1 */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="glass-card" style={{ padding: '1.2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                        <h2 style={{ fontSize: '0.9rem', fontWeight: '800' }}>USER MANAGEMENT OVERVIEW</h2>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--gray)', background: '#f0f2f5', padding: '2px 8px', borderRadius: '10px' }}>Recent Activity (30 days)</span>
                                    </div>
                                    <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #f0f2f5', color: 'var(--gray)' }}>
                                                <th style={{ padding: '0.5rem 0' }}>Role</th>
                                                <th style={{ padding: '0.5rem 0' }}>Type</th>
                                                <th style={{ padding: '0.5rem 0' }}>Recent</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid #f0f2f5' }}>
                                                <td style={{ padding: '0.8rem 0', fontWeight: '600' }}>Admin</td>
                                                <td>New User</td>
                                                <td>New user sign-up</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #f0f2f5' }}>
                                                <td style={{ padding: '0.8rem 0', fontWeight: '600' }}>Farmer</td>
                                                <td>New User</td>
                                                <td>New user sign-up</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0.8rem 0', fontWeight: '600' }}>Buyer</td>
                                                <td>Buyer</td>
                                                <td>New user sign-up</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="glass-card" style={{ padding: '1.2rem' }}>
                                    <h2 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1rem' }}>PLATFORM ACTIVITY MONITOR</h2>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--gray)', marginBottom: '1rem' }}>Platform Transactions (Last 3 Months)</p>
                                    <div style={{ height: '150px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={activityData}>
                                                <defs>
                                                    <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#274d28" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#274d28" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <Area type="monotone" dataKey="value" stroke="#274d28" fillOpacity={1} fill="url(#colorAct)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div style={{ background: '#e8f5e9', padding: '0.6rem', borderRadius: '8px', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#274d28' }}>Platform Fees (30 days): ₹1,250.00</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ fontSize: '0.65rem', color: 'var(--gray)' }}>Total Registered Users</p>
                                            <p style={{ fontWeight: '800', fontSize: '1rem' }}>330</p>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ fontSize: '0.65rem', color: 'var(--gray)' }}>Total Active Users</p>
                                            <p style={{ fontWeight: '800', fontSize: '1rem' }}>150</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2 */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="glass-card" style={{ padding: '1.2rem' }}>
                                    <h2 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1rem' }}>SYSTEM HEALTH MONITOR</h2>
                                    <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', background: '#fdf5e6' }}>
                                                <th style={{ padding: '0.5rem' }}>Status</th>
                                                <th style={{ padding: '0.5rem', background: '#f5b7b1' }}>Lights</th>
                                                <th style={{ padding: '0.5rem' }}>Lights</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid #f0f2f5' }}>
                                                <td style={{ padding: '0.8rem 0.5rem' }}>Database Connections</td>
                                                <td style={{ padding: '0.8rem 0.5rem' }}><span style={{ color: '#2ecc71', fontWeight: '700' }}>Active</span></td>
                                                <td style={{ padding: '0.8rem 0.5rem' }}><CheckCircle size={14} color="#2ecc71" fill="#2ecc71" /></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #f0f2f5' }}>
                                                <td style={{ padding: '0.8rem 0.5rem' }}>Application Servers</td>
                                                <td style={{ padding: '0.8rem 0.5rem' }}><span style={{ color: '#2ecc71', fontWeight: '700' }}>Active</span></td>
                                                <td style={{ padding: '0.8rem 0.5rem' }}><AlertCircle size={14} color="#e74c3c" fill="#e74c3c" /></td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0.8rem 0.5rem' }}>Prediction Engine Latency</td>
                                                <td style={{ padding: '0.8rem 0.5rem' }}><span style={{ color: '#2ecc71', fontWeight: '700' }}>Updated & Runn</span></td>
                                                <td style={{ padding: '0.8rem 0.5rem' }}><CheckCircle size={14} color="#2ecc71" fill="#2ecc71" /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="glass-card" style={{ padding: '1.2rem' }}>
                                    <h2 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1rem' }}>DATA INTEGRITY CHECK</h2>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button style={{ background: '#274d28', color: 'white', padding: '0.6rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', flex: 1 }}>Check Integrity</button>
                                        <div style={{ flex: 1, background: '#e8f5e9', padding: '0.6rem', borderRadius: '6px', textAlign: 'center', fontSize: '0.8rem', fontWeight: '700', color: '#274d28' }}>Status</div>
                                    </div>
                                </div>

                                <div className="glass-card" style={{ padding: '1.2rem' }}>
                                    <h2 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1rem' }}>DEMAND PREDICTION ACCURACY</h2>
                                    <div style={{ height: '120px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={accuracyData}>
                                                <Line type="monotone" dataKey="actual" stroke="#274d28" strokeWidth={2} dot={false} />
                                                <Line type="monotone" dataKey="predicted" stroke="#87ceeb" strokeWidth={2} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem', fontSize: '0.7rem' }}>
                                        <span style={{ fontWeight: '700' }}>MAE = 0.74</span>
                                        <span style={{ color: '#e67e22', fontWeight: '700' }}>Actual Sales</span>
                                    </div>
                                </div>

                                <div className="glass-card" style={{ padding: '1.2rem' }}>
                                    <h2 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1.2rem' }}>PLATFORM ANALYTICS OVERVIEW</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                                        <div>
                                            <p style={{ fontSize: '0.6rem', color: 'var(--gray)' }}>Number of Listings</p>
                                            <p style={{ fontWeight: '800', fontSize: '0.9rem', color: '#274d28' }}>100</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.6rem', color: 'var(--gray)' }}>Total Orders</p>
                                            <p style={{ fontWeight: '800', fontSize: '0.9rem', color: '#274d28' }}>98</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.6rem', color: 'var(--gray)' }}>Total Revenue</p>
                                            <p style={{ fontWeight: '800', fontSize: '0.9rem', color: '#274d28' }}>₹3,870.00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 3 */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="glass-card" style={{ padding: '1.2rem' }}>
                                    <h2 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1rem' }}>MARKET-WIDE CROP PERFORMANCE (Aggregate View)</h2>
                                    <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #f0f2f5', color: 'var(--gray)' }}>
                                                <th style={{ padding: '0.5rem 0' }}>Crop</th>
                                                <th style={{ padding: '0.5rem 0' }}>Aggregate Platform Sales Volume</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid #f0f2f5' }}>
                                                <td style={{ padding: '0.8rem 0', fontWeight: '600' }}>Tomatoes</td>
                                                <td style={{ padding: '0.8rem 0' }}>₹ 375 kg</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #f0f2f5' }}>
                                                <td style={{ padding: '0.8rem 0', fontWeight: '600' }}>Corn</td>
                                                <td style={{ padding: '0.8rem 0' }}>₹ 200 kg</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0.8rem 0', fontWeight: '600' }}>Potatoes</td>
                                                <td style={{ padding: '0.8rem 0' }}>1,250 kg</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="glass-card" style={{ padding: '1.2rem', flex: 1 }}>
                                    <h2 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1rem' }}>REGIONAL SALES HEATMAP</h2>
                                    <div style={{ height: '220px', background: '#f8faf9', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                                        {/* Placeholder for map heatmap */}
                                        <div style={{
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/China_location_map.svg/1024px-China_location_map.svg.png")',
                                            backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                                            opacity: 0.2
                                        }}></div>
                                        <div style={{ position: 'absolute', top: '40%', left: '30%', width: '30px', height: '30px', background: 'rgba(52, 152, 219, 0.4)', borderRadius: '50%', filter: 'blur(10px)' }}></div>
                                        <div style={{ position: 'absolute', top: '60%', left: '70%', width: '50px', height: '50px', background: 'rgba(231, 76, 60, 0.4)', borderRadius: '50%', filter: 'blur(15px)' }}></div>
                                        <div style={{ position: 'absolute', top: '50%', left: '60%', width: '40px', height: '40px', background: 'rgba(241, 196, 15, 0.4)', borderRadius: '50%', filter: 'blur(12px)' }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 4 */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="glass-card" style={{ padding: '1.2rem' }}>
                                    <h2 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1rem' }}>FARMER RATING DISTRIBUTION (Marketplace-wide)</h2>
                                    <div style={{ height: '120px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={ratingData}>
                                                <Bar dataKey="value">
                                                    {ratingData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={['#5dade2', '#58d68d', '#f7dc6f', '#f5b041'][index % 4]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.7rem', fontWeight: '700' }}>
                                        <span>Jan</span><span>Feb</span><span>Farm</span><span>Buyer</span>
                                    </div>
                                </div>

                                <div className="glass-card" style={{ padding: '1.2rem' }}>
                                    <h2 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1rem' }}>NEW USER REGISTRATIONS (Aggregate View)</h2>
                                    <div style={{ height: '140px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={registrationData}>
                                                <Area type="monotone" dataKey="farmers" stroke="#274d28" fill="#274d28" fillOpacity={0.1} />
                                                <Area type="monotone" dataKey="admins" stroke="#3498db" fill="#3498db" fillOpacity={0.1} />
                                                <Area type="monotone" dataKey="buyers" stroke="#e67e22" fill="#e67e22" fillOpacity={0.1} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.6rem', fontWeight: '700' }}>
                                        <span style={{ color: '#3498db' }}>Admins</span>
                                        <span style={{ color: '#274d28' }}>Farmers</span>
                                        <span style={{ color: '#e67e22' }}>Buyers</span>
                                    </div>
                                </div>

                                <div className="glass-card" style={{ padding: '1.2rem', flex: 1 }}>
                                    <h2 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1.2rem' }}>ADMIN ACTIONS LOG</h2>
                                    <div style={{ overflowY: 'auto', maxHeight: '180px', fontSize: '0.75rem' }}>
                                        <div style={{ padding: '0.8rem 0', borderBottom: '1px solid #f0f2f5' }}>
                                            <span style={{ fontWeight: '700' }}>User [Admin1]</span> modified model parameters
                                        </div>
                                        <div style={{ padding: '0.8rem 0', borderBottom: '1px solid #f0f2f5' }}>
                                            <span style={{ fontWeight: '700' }}>User [Admin2]</span> suspended Farmer Account [F-123]
                                        </div>
                                        <div style={{ padding: '0.8rem 0', borderBottom: '1px solid #f0f2f5' }}>
                                            <span style={{ fontWeight: '700' }}>User [Admin2]</span> suspended Farmer Account [F-123]
                                        </div>
                                        <div style={{ padding: '0.8rem 0' }}>
                                            <span style={{ fontWeight: '700' }}>User [Admin1]</span> suspended Farmer Account [F-123]
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default AdminDashboard;
