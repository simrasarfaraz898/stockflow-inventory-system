import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Package, Users, ShoppingCart, Menu, X } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/products', icon: Package, label: 'Products' },
    { to: '/customers', icon: Users, label: 'Customers' },
    { to: '/orders', icon: ShoppingCart, label: 'Orders' },
  ];

  return (
    <Router>
      <div className="app-layout">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-icon">⬡</span>
              <span className="logo-text">StockFlow</span>
            </div>
            <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <nav className="sidebar-nav">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-footer">
            <p>Inventory & Order Management</p>
            <span>v1.0.0</span>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

        {/* Main Content */}
        <div className="main-wrapper">
          <header className="topbar">
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="topbar-title">
              <span className="logo-icon">⬡</span>
              <span>StockFlow</span>
            </div>
          </header>
          <main className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1a1a2e', color: '#e2e8f0', border: '1px solid #2d2d4e' },
        success: { iconTheme: { primary: '#6ee7b7', secondary: '#1a1a2e' } },
        error: { iconTheme: { primary: '#f87171', secondary: '#1a1a2e' } },
      }} />
    </Router>
  );
}

export default App;
