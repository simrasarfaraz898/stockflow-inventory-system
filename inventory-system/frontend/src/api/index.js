import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});

// Products
export const getProducts = () => API.get('/products');
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Customers
export const getCustomers = () => API.get('/customers');
export const getCustomer = (id) => API.get(`/customers/${id}`);
export const createCustomer = (data) => API.post('/customers', data);
export const updateCustomer = (id, data) => API.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => API.delete(`/customers/${id}`);

// Orders
export const getOrders = () => API.get('/orders');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const createOrder = (data) => API.post('/orders', data);
export const updateOrderStatus = (id, status) => API.patch(`/orders/${id}/status`, { status });

// Dashboard
export const getDashboardStats = () => API.get('/dashboard/stats');
