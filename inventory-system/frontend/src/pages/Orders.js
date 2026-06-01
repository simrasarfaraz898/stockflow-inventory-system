import React, { useEffect, useState } from 'react';
import { Plus, X, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { getOrders, getProducts, getCustomers, createOrder, updateOrderStatus } from '../api';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [customerId, setCustomerId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }]);

  const load = async () => {
    const [o, p, c] = await Promise.all([getOrders(), getProducts(), getCustomers()]);
    setOrders(o.data);
    setProducts(p.data);
    setCustomers(c.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setCustomerId('');
    setNotes('');
    setItems([{ product_id: '', quantity: 1 }]);
    setCreateModal(true);
  };

  const addItem = () => setItems([...items, { product_id: '', quantity: 1 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  };

  const calcTotal = () => {
    return items.reduce((sum, item) => {
      const prod = products.find(p => p.id === parseInt(item.product_id));
      return sum + (prod ? prod.price * (parseInt(item.quantity) || 0) : 0);
    }, 0);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const validItems = items.filter(i => i.product_id && i.quantity > 0);
    if (!validItems.length) { toast.error('Add at least one item'); return; }
    setSaving(true);
    try {
      await createOrder({
        customer_id: parseInt(customerId),
        notes,
        items: validItems.map(i => ({ product_id: parseInt(i.product_id), quantity: parseInt(i.quantity) })),
      });
      toast.success('Order created!');
      setCreateModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error creating order');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Status updated to ${status}`);
      load();
      if (detailModal) setDetailModal(prev => ({ ...prev, status }));
    } catch (err) {
      toast.error('Error updating status');
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /><span>Loading orders...</span></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">{orders.length} total orders</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> New Order</button>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>No orders yet</h3>
          <p>Create your first order to start tracking sales.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td><span className="sku-mono">#{String(o.id).padStart(4, '0')}</span></td>
                  <td style={{ fontWeight: 600 }}>{o.customer?.name || `Customer #${o.customer_id}`}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{o.items?.length || 0} item(s)</td>
                  <td><span className="price-mono">${o.total_amount.toFixed(2)}</span></td>
                  <td>
                    <select
                      className={`badge badge-${o.status}`}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 11 }}
                      value={o.status}
                      onChange={e => handleStatusChange(o.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => setDetailModal(o)}>
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Order Modal */}
      {createModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setCreateModal(false)}>
          <div className="modal" style={{ maxWidth: 580 }}>
            <div className="modal-header">
              <h2 className="modal-title">New Order</h2>
              <button className="modal-close" onClick={() => setCreateModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Customer *</label>
                <select required value={customerId} onChange={e => setCustomerId(e.target.value)}>
                  <option value="">Select a customer...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Order Items *</label>
                <div className="order-items-list">
                  {items.map((item, i) => {
                    const prod = products.find(p => p.id === parseInt(item.product_id));
                    return (
                      <div key={i} className="order-item-row">
                        <select value={item.product_id} onChange={e => updateItem(i, 'product_id', e.target.value)}>
                          <option value="">Select product...</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} — ${p.price.toFixed(2)} (Stock: {p.stock_quantity})
                            </option>
                          ))}
                        </select>
                        <input
                          type="number" min="1"
                          max={prod?.stock_quantity || 9999}
                          value={item.quantity}
                          onChange={e => updateItem(i, 'quantity', e.target.value)}
                        />
                        <button type="button" className="remove-item-btn" onClick={() => removeItem(i)} disabled={items.length === 1}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button type="button" className="add-item-btn" onClick={addItem}>+ Add Item</button>
              </div>

              <div style={{ background: 'var(--bg-hover)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Estimated Total</span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 18, fontWeight: 700, color: 'var(--accent-2)' }}>${calcTotal().toFixed(2)}</span>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional order notes..." style={{ minHeight: 60 }} />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Placing...' : 'Place Order'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {detailModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDetailModal(null)}>
          <div className="modal" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h2 className="modal-title">Order #{String(detailModal.id).padStart(4, '0')}</h2>
              <button className="modal-close" onClick={() => setDetailModal(null)}><X size={18} /></button>
            </div>

            <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Customer</span>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{detailModal.customer?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Status</span>
                <span className={`badge badge-${detailModal.status}`}>{detailModal.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Date</span>
                <span style={{ fontSize: 13 }}>{new Date(detailModal.created_at).toLocaleString()}</span>
              </div>
              {detailModal.notes && (
                <div style={{ padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Notes</span>
                  <span style={{ fontSize: 13 }}>{detailModal.notes}</span>
                </div>
              )}
            </div>

            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Items</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {detailModal.items?.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{item.product?.name || `Product #${item.product_id}`}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Qty: {item.quantity} × ${item.unit_price.toFixed(2)}</div>
                  </div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>${(item.quantity * item.unit_price).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--bg-hover)', borderRadius: 10, marginBottom: 20 }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 20, fontWeight: 700, color: 'var(--accent-2)' }}>${detailModal.total_amount.toFixed(2)}</span>
            </div>

            <div className="form-group">
              <label>Update Status</label>
              <select value={detailModal.status} onChange={e => { handleStatusChange(detailModal.id, e.target.value); setDetailModal({ ...detailModal, status: e.target.value }); }}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDetailModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
