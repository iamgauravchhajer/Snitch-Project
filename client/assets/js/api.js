const BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port !== '3000'
    ? 'http://localhost:3000/api'
    : '/api';

function getToken() { return localStorage.getItem('accessToken'); }
function setToken(t) { localStorage.setItem('accessToken', t); }
function setUser(u) { localStorage.setItem('user', JSON.stringify(u)); }
function getUser() { const u = localStorage.getItem('user'); return u ? JSON.parse(u) : null; }
function clearAuth() { localStorage.removeItem('accessToken'); localStorage.removeItem('user'); }

async function request(path, options = {}, isRetry = false) {
    const token = getToken();
    const headers = options.headers || {};
    
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers, credentials: 'include' });
    const data = await res.json().catch(() => ({}));

    if (res.status === 401 && !isRetry && path !== '/auth/login' && path !== '/auth/register' && path !== '/auth/refresh-token') {
        try {
            const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
                method: 'POST',
                credentials: 'include'
            });
            if (refreshRes.ok) {
                const refreshData = await refreshRes.json();
                if (refreshData.accessToken) {
                    setToken(refreshData.accessToken);
                    if (refreshData.userData) setUser(refreshData.userData);
                    return await request(path, options, true);
                }
            } else {
                clearAuth();
            }
        } catch (err) {
            clearAuth();
        }
    }

    if (!res.ok) throw { status: res.status, message: data.message || 'Something went wrong' };
    return data;
}

const api = {
    auth: {
        register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
        login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
        logout: () => request('/auth/logout', { method: 'POST' }),
        me: () => request('/auth/me'),
        refreshToken: () => request('/auth/refresh-token', { method: 'POST' }),
    },
    products: {
        getAll: () => request('/products'),
        getById: (id) => request(`/products/${id}`),
        getSellerProducts: () => request('/products/seller'),
        create: (formData) => request('/products/create', { method: 'POST', body: formData }),
        update: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
        delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
    },
    cart: {
        get: () => request('/cart'),
        add: (body) => request('/cart/add', { method: 'POST', body: JSON.stringify(body) }),
    }
};

export { api, getToken, setToken, setUser, getUser, clearAuth };

