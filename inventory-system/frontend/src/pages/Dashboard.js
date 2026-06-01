import React, { useEffect, useState } from 'react';
import { Package, Users, ShoppingCart, DollarSign, AlertTriangle, Clock } from 'lucide-react';
import { getDashboardStats } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /><span>Loading dashboard...</span></div>;

  const cards = [
    { label: 'Total Products', value: stats?.total_products ?? 0, icon: Package, color: 'blue' },
    { label: 'Total Customers', value: stats?.total_customers ?? 0, icon: Users, color: 'green' },
    { label: 'Total Orders', value: stats?.total_orders ?? 0, icon: ShoppingCart, color: 'yellow' },
    { label: 'Total Revenue', value: `$${(stats?.total_revenue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'blue' },
    { label: 'Low Stock Items', value: stats?.low_stock_count ?? 0, icon: AlertTriangle, color: 'red' },
    { label: 'Pending Orders', value: stats?.pending_orders ?? 0, icon: Clock, color: 'yellow' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your inventory and orders</p>
        </div>
      </div>

      <div className="stat-grid">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`stat-card ${color}`}>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
            <div className="stat-icon"><Icon size={40} /></div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Quick Start Guide</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { step: '01', title: 'Add Products', desc: 'Go to Products and add your inventory items with SKUs, prices, and stock levels.' },
            { step: '02', title: 'Register Customers', desc: 'Add customer records with unique email addresses in the Customers section.' },
            { step: '03', title: 'Create Orders', desc: 'Place orders in the Orders section — stock is automatically deducted upon creation.' },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{ padding: 16, background: 'var(--bg-hover)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--accent)', marginBottom: 8 }}>{step}</div>
              <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14 }}>{title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
