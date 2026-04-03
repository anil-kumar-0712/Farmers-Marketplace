import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard3D from '../components/Dashboard3D';
import AgriNews from '../components/AgriNews';
import {
    Plus, Trash2, Home, LayoutGrid, Calendar, Bell, Settings,
    LogOut, User as UserIcon, Search, BellRing, ChevronUp, ChevronDown,
    TrendingUp, TrendingDown, Package, ShoppingCart, DollarSign
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

const trendData = [
    { name: 'Jan', value: 30, trend: 15 },
    { name: 'Feb', value: 45, trend: 20 },
    { name: 'Mar', value: 40, trend: 22 },
    { name: 'Apr', value: 60, trend: 18 },
    { name: 'May', value: 55, trend: 25 },
    { name: 'Jun', value: 80, trend: 30 },
];

const FarmerDashboard = () => {
    const navigate = useNavigate();
    const [crops, setCrops] = useState([]);
    const [orders, setOrders] = useState([]);
    const [formData, setFormData] = useState({ cropName: '', pricePerKg: '', quantity: '' });
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const containerRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from('.sidebar-icon', {
            x: -50,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out'
        })
            .from('.dashboard-header', {
                y: -20,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.3')
            .from('.glass-card', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            }, '-=0.4');

        // Table rows animation
        if (!loading) {
            gsap.from('tr', {
                opacity: 0,
                x: -10,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power1.out',
                delay: 1
            });
        }
    }, { dependencies: [loading], scope: containerRef });

    useEffect(() => {
        fetchMyCrops();
        fetchFarmerOrders();
    }, []);

    const fetchFarmerOrders = async () => {
        try {
            const res = await axios.get('/api/orders/farmer');
            setOrders(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMyCrops = async () => {
        try {
            const res = await axios.get('/api/crops/my');
            setCrops(res.data.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleAddCrop = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/crops', formData);
            setShowAddModal(false);
            setFormData({ cropName: '', pricePerKg: '', quantity: '' });
            fetchMyCrops();
        } catch (err) {
            alert('Failed to add crop');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this listing?')) {
            try {
                await axios.delete(`/api/crops/${id}`);
                fetchMyCrops();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    return (
        <>
            <Dashboard3D />
            <div className="dashboard-layout fade-in" ref={containerRef}>
                {/* Sidebar */}
                <aside className="dashboard-sidebar">
                    <div className="sidebar-icon active" onClick={() => navigate('/farmer')} title="Home"><Home size={22} /></div>
                    <div className="sidebar-icon" onClick={() => navigate('/predict')} title="Predictions"><LayoutGrid size={22} /></div>
                    <div className="sidebar-icon" onClick={() => alert('Calendar feature coming soon!')} title="Calendar"><Calendar size={22} /></div>
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
                            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
                                <UserIcon size={24} style={{ background: '#e5e7eb', padding: '4px', borderRadius: '50%' }} />
                            </div>
                            <Bell size={20} style={{ cursor: 'pointer' }} onClick={() => alert('No new notifications')} />
                            <Settings size={20} style={{ cursor: 'pointer' }} onClick={() => alert('Settings coming soon')} />
                        </div>
                    </header>

                    <div className="dashboard-grid">
                        {/* Left Column: Predictions */}
                        <section>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '700', color: 'var(--dark)' }}>CLEANED PREDICTIONS</h2>

                            <div style={{ height: '420px', marginBottom: '1.5rem' }}>
                                <AgriNews />
                            </div>

                            <div className="glass-card" style={{ padding: '1.2rem', marginBottom: '1.5rem', borderLeft: '5px solid #274d28' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: '700' }}>TOMATOES (Sep Demand)</p>
                                <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#274d28' }}>34% Increase</h2>
                            </div>

                            <div className="glass-card" style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem' }}>PRODUCTION RECOMMENDATION SUMMARY</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <RecommendationItem icon="🌾" name="Wheat" trend="-5%" color="#e67e22" width="40%" isNegative />
                                    <RecommendationItem icon="🌽" name="Corn" trend="+10%" color="#274d28" width="60%" />
                                    <RecommendationItem icon="🌾" name="Wheat" trend="18%" color="#274d28" width="75%" />
                                    <RecommendationItem icon="🥔" name="Potatoes" trend="-15%" color="#e67e22" width="30%" isNegative />
                                </div>
                            </div>
                        </section>

                        {/* Right Column: Actions */}
                        <section>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '700', color: 'var(--dark)' }}>CLEANED ACTIONS & TRANSACTIONS</h2>

                            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1.2rem' }}>MANAGE LISTINGS & RECENT TRANSACTIONS</h3>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#3d7a40' }}>Add New Crop</button>
                                    <button className="btn" style={{ flex: 1, justifyContent: 'center', border: '1px solid #3d7a40', color: '#3d7a40' }}>Edit Existing</button>
                                </div>

                                <h4 style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.8rem' }}>ACTIVE LISTINGS</h4>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                    <thead>
                                        <tr style={{ background: '#f8faf9', textAlign: 'left' }}>
                                            <th style={{ padding: '0.8rem 0.5rem' }}>Crop</th>
                                            <th style={{ padding: '0.8rem 0.5rem' }}>Quantity Available</th>
                                            <th style={{ padding: '0.8rem 0.5rem' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {crops.length > 0 ? crops.map(c => (
                                            <tr key={c._id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                                                <td style={{ padding: '0.8rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                                                    <span>🥔</span> {c.cropName}
                                                </td>
                                                <td style={{ padding: '0.8rem 0.5rem' }}>{c.quantity} kg</td>
                                                <td style={{ padding: '0.8rem 0.5rem' }}><span className="status-badge status-active">Active</span></td>
                                            </tr>
                                        )) : (
                                            <>
                                                <tr style={{ borderBottom: '1px solid #f0f2f5' }}>
                                                    <td style={{ padding: '0.8rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}><span>🥔</span> Potatoes</td>
                                                    <td style={{ padding: '0.8rem 0.5rem' }}>500 kg</td>
                                                    <td style={{ padding: '0.8rem 0.5rem' }}><span className="status-badge status-active">Active</span></td>
                                                </tr>
                                                <tr style={{ borderBottom: '1px solid #f0f2f5' }}>
                                                    <td style={{ padding: '0.8rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}><span>🌽</span> Corn</td>
                                                    <td style={{ padding: '0.8rem 0.5rem' }}>500 kg</td>
                                                    <td style={{ padding: '0.8rem 0.5rem' }}><span className="status-badge status-active">Active</span></td>
                                                </tr>
                                                <tr style={{ borderBottom: '1px solid #f0f2f5' }}>
                                                    <td style={{ padding: '0.8rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}><span>🌾</span> Wheat</td>
                                                    <td style={{ padding: '0.8rem 0.5rem' }}>200 kg</td>
                                                    <td style={{ padding: '0.8rem 0.5rem' }}><span className="status-badge status-active">Active</span></td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem' }}>RECENT ORDERS</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                    <thead>
                                        <tr style={{ background: '#f8faf9', textAlign: 'left' }}>
                                            <th style={{ padding: '0.8rem 0.5rem' }}>Buyer</th>
                                            <th style={{ padding: '0.8rem 0.5rem' }}>Detail</th>
                                            <th style={{ padding: '0.8rem 0.5rem' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length > 0 ? orders.map(order => (
                                            <OrderRow
                                                key={order._id}
                                                buyer={order.buyer?.name || 'Unknown Buyer'}
                                                detail={`${order.crop?.cropName || 'Crop'} (${order.quantity} kg)`}
                                                status={order.status}
                                            />
                                        )) : (
                                            <tr>
                                                <td colSpan="3" style={{ padding: '1rem', textAlign: 'center', color: 'var(--gray)' }}>No orders received yet</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="glass-card" style={{ padding: '1.5rem' }}>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--gray)', fontWeight: '600' }}>Total Orders (30 days)</p>
                                    <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#274d28' }}>{orders.length}</h2>
                                </div>
                                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--gray)', fontWeight: '600' }}>Last Payment Received</p>
                                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>₹375.00</h2>
                                    </div>
                                    <span className="status-badge status-confirmed">Confirmed</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Modal Appears Over Everything */}
                    {showAddModal && (
                        <div className="modal-overlay">
                            <div className="modal-container fade-in">
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--dark)' }}>
                                    List New Crop
                                </h2>
                                <form onSubmit={handleAddCrop}>
                                    <div className="input-group">
                                        <label className="input-label">Crop Name</label>
                                        <div className="input-wrapper">
                                            <Package className="input-icon" size={18} />
                                            <input
                                                required
                                                className="auth-input"
                                                placeholder="e.g. Organic Tomatoes"
                                                value={formData.cropName}
                                                onChange={e => setFormData({ ...formData, cropName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                        <div className="input-group" style={{ marginBottom: 0 }}>
                                            <label className="input-label">Price/kg ($)</label>
                                            <div className="input-wrapper">
                                                <DollarSign className="input-icon" size={17} />
                                                <input
                                                    type="number"
                                                    required
                                                    className="auth-input"
                                                    placeholder="2.50"
                                                    value={formData.pricePerKg}
                                                    onChange={e => setFormData({ ...formData, pricePerKg: Number(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                        <div className="input-group" style={{ marginBottom: 0 }}>
                                            <label className="input-label">Quantity (kg)</label>
                                            <div className="input-wrapper">
                                                <ShoppingCart className="input-icon" size={17} />
                                                <input
                                                    type="number"
                                                    required
                                                    className="auth-input"
                                                    placeholder="500"
                                                    value={formData.quantity}
                                                    onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="btn"
                                            style={{ flex: 1, justifyContent: 'center', border: '1px solid var(--border-color)', background: 'white' }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            style={{ flex: 1, justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}
                                        >
                                            List Crop
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

const RecommendationItem = ({ icon, name, trend, color, width, isNegative }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 60px', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{icon}</span> <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{name}</span>
        </div>
        <div className="trend-bar">
            <div className="trend-fill" style={{ width, background: color }}></div>
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: '800', color: isNegative ? 'var(--negative)' : 'var(--positive)', textAlign: 'right' }}>
            {trend}
        </span>
    </div>
);

const OrderRow = ({ buyer, detail, status }) => {
    const getBadgeClass = (s) => {
        if (s === 'processing') return 'status-processing';
        if (s === 'confirmed' || s === 'delivered') return 'status-confirmed';
        if (s === 'pending') return 'status-active';
        if (s === 'shipped') return 'status-processing';
        if (s === 'cancelled') return 'status-negative';
        return '';
    };

    return (
        <tr style={{ borderBottom: '1px solid #f0f2f5' }}>
            <td style={{ padding: '0.8rem 0.5rem', fontWeight: '600' }}>{buyer}</td>
            <td style={{ padding: '0.8rem 0.5rem', color: 'var(--gray)' }}>{detail}</td>
            <td style={{ padding: '0.8rem 0.5rem' }}>
                {status === 'details' ? (
                    <button style={{ background: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700' }}>View Details</button>
                ) : (
                    <span className={`status-badge ${getBadgeClass(status)}`}>{status}</span>
                )}
            </td>
        </tr>
    );
};

export default FarmerDashboard;
