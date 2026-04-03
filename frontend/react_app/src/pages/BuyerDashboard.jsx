import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard3D from '../components/Dashboard3D';
import { ShoppingCart, Search, Filter, Phone, Mail, User, X, MapPin, Package } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

const BuyerDashboard = () => {
    const [crops, setCrops] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const containerRef = useRef();

    useGSAP(() => {
        if (!loading && crops.length > 0) {
            gsap.from('.crop-card', {
                y: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }
    }, { dependencies: [loading, crops], scope: containerRef });

    // Checkout State
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [orderForm, setOrderForm] = useState({
        quantity: 1,
        street: '',
        city: '',
        district: '',
        state: '',
        pincode: ''
    });
    const [placingOrder, setPlacingOrder] = useState(false);

    useEffect(() => {
        fetchCrops();
    }, []);

    const fetchCrops = async () => {
        try {
            const res = await axios.get('/api/crops');
            setCrops(res.data.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleBuyClick = (crop) => {
        setSelectedCrop(crop);
        setOrderForm({
            quantity: 1,
            street: '',
            city: '',
            district: '',
            state: '',
            pincode: ''
        });
        setShowBuyModal(true);
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!selectedCrop) return;

        if (orderForm.quantity > selectedCrop.quantity) {
            alert('Insufficient stock available');
            return;
        }

        setPlacingOrder(true);
        try {
            // 1. Create Internal Order (Pending Payment)
            const orderRes = await axios.post('/api/orders', {
                cropId: selectedCrop._id,
                quantity: orderForm.quantity,
                shippingAddress: {
                    street: orderForm.street,
                    city: orderForm.city,
                    district: orderForm.district,
                    state: orderForm.state,
                    pincode: orderForm.pincode
                }
            });

            const internalOrder = orderRes.data.data;

            // 2. Create Razorpay Order
            const totalAmount = selectedCrop.pricePerKg * orderForm.quantity;
            const razorpayOrderRes = await axios.post('/api/payments/create-order', {
                amount: totalAmount,
                receipt: internalOrder._id
            });

            const { order_id, amount, currency } = razorpayOrderRes.data;

            // 3. Get Razorpay Key
            const keyRes = await axios.get('/api/payments/get-key');
            const keyId = keyRes.data.keyId;

            // 4. Load Razorpay Script
            const res = await loadRazorpayScript();
            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
                return;
            }

            // 5. Open Razorpay Checkout
            const options = {
                key: keyId,
                amount: amount,
                currency: currency,
                name: 'Farmers Marketplace',
                description: `Payment for ${selectedCrop.cropName}`,
                order_id: order_id,
                handler: async function (response) {
                    try {
                        // 5. Verify Payment
                        const verifyRes = await axios.post('/api/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: internalOrder._id
                        });

                        if (verifyRes.data.success) {
                            alert('Order placed and payment verified successfully!');
                            setShowBuyModal(false);
                            fetchCrops(); // Refresh stock
                        } else {
                            alert('Payment verification failed.');
                        }
                    } catch (err) {
                        console.error('Verification Error:', err);
                        alert('Error verifying payment.');
                    }
                },
                prefill: {
                    name: 'User Name', // Should come from user context
                    email: 'user@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#2e7d32'
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            alert(err.response?.data?.message || 'Failed to initiate order');
        } finally {
            setPlacingOrder(false);
        }
    };

    const filteredCrops = crops.filter(c =>
        c.cropName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container fade-in" style={{ paddingBottom: '3rem' }} ref={containerRef}>
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Marketplace</h1>
                    <p style={{ color: 'var(--gray)' }}>Fresh harvest directly from local farmers</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                        <input
                            placeholder="Search crops..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '25px', border: '1px solid #ddd', width: '300px' }}
                        />
                    </div>
                </div>
            </header>

            {loading ? (
                <p>Loading marketplace...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {filteredCrops.map(crop => (
                        <div key={crop._id} className="glass-card crop-card fade-in" style={{ overflow: 'hidden' }}>
                            <div style={{ height: '180px', background: '#eef2f3', position: 'relative' }}>
                                <div style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    background: crop.quantity > 0 ? 'var(--primary)' : 'var(--danger)', color: 'white', padding: '0.3rem 0.8rem',
                                    borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700'
                                }}>
                                    {crop.quantity > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                                </div>
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                                    <ShoppingCart size={48} />
                                </div>
                            </div>
                            <div style={{ padding: '1.2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{crop.cropName}</h3>
                                    <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.2rem' }}>₹{crop.pricePerKg}/kg</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '1.2rem' }}>Available: {crop.quantity} kg</p>

                                <div style={{
                                    padding: '1rem', background: '#f8fafc', borderRadius: '10px',
                                    border: '1px solid #edf2f7', fontSize: '0.85rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontWeight: '600' }}>
                                        <User size={14} /> {crop.farmer?.name || 'Local Farmer'}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray)' }}>
                                        <Phone size={14} /> {crop.farmer?.mobile || 'Contact shared on buy'}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleBuyClick(crop)}
                                    disabled={crop.quantity === 0}
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginTop: '1.2rem', justifyContent: 'center', opacity: crop.quantity === 0 ? 0.6 : 1 }}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Checkout Modal */}
            {showBuyModal && selectedCrop && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="glass-card fade-in" style={{ padding: '2rem', width: '450px', position: 'relative' }}>
                        <button
                            onClick={() => setShowBuyModal(false)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', color: 'var(--gray)' }}
                        >
                            <X size={24} />
                        </button>

                        <h2 style={{ marginBottom: '0.5rem', fontWeight: '800' }}>Checkout</h2>
                        <p style={{ color: 'var(--gray)', marginBottom: '2rem', fontSize: '0.9rem' }}>Review your order for {selectedCrop.cropName}</p>

                        <form onSubmit={handlePlaceOrder}>
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-soft)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.9rem' }}>Price per kg</span>
                                    <span style={{ fontWeight: '700' }}>₹{selectedCrop.pricePerKg}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem' }}>Quantity (kg)</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max={selectedCrop.quantity}
                                        required
                                        className="auth-input"
                                        style={{ width: '80px', padding: '0.4rem', textAlign: 'center' }}
                                        value={orderForm.quantity}
                                        onChange={e => setOrderForm({ ...orderForm, quantity: Number(e.target.value) })}
                                    />
                                </div>
                                <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #ddd' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: '700' }}>Total Amount</span>
                                    <span style={{ fontWeight: '900', fontSize: '1.4rem', color: 'var(--primary)' }}>
                                        ₹{(selectedCrop.pricePerKg * orderForm.quantity).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="input-label"><MapPin size={16} /> Delivery Address</label>
                                <input
                                    required placeholder="Street / House No." className="auth-input" style={{ marginBottom: '0.8rem' }}
                                    value={orderForm.street} onChange={e => setOrderForm({ ...orderForm, street: e.target.value })}
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                    <input
                                        required placeholder="City" className="auth-input"
                                        value={orderForm.city} onChange={e => setOrderForm({ ...orderForm, city: e.target.value })}
                                    />
                                    <input
                                        required placeholder="District" className="auth-input"
                                        value={orderForm.district} onChange={e => setOrderForm({ ...orderForm, district: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                    <input
                                        required placeholder="State" className="auth-input"
                                        value={orderForm.state} onChange={e => setOrderForm({ ...orderForm, state: e.target.value })}
                                    />
                                    <input
                                        required placeholder="Pincode" className="auth-input"
                                        value={orderForm.pincode} onChange={e => setOrderForm({ ...orderForm, pincode: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={placingOrder}
                                className="btn btn-primary"
                                style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}
                            >
                                {placingOrder ? 'Processing...' : 'Confirm Order'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const PageWrapper = () => (
    <>
        <Dashboard3D />
        <BuyerDashboard />
    </>
);

export default PageWrapper;
