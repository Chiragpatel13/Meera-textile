// API configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper function to handle API responses
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};

// Product API functions
export const getAllProducts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getLowStockProducts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/low-stock`, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching low stock products:', error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const updateProduct = async (productId, productData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'PUT',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const updateInventory = async (productId, inventoryData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}/inventory`, {
            method: 'PUT',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inventoryData)
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Error updating inventory:', error);
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        
        const data = await handleResponse(response);
        
        // Validate response data
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid response format');
        }

        const { token, user } = data;

        if (!token || !user || typeof user !== 'object') {
            throw new Error('Invalid login response');
        }

        localStorage.setItem('token', token);
        localStorage.setItem('userName', user.full_name || user.username || '');
        localStorage.setItem('userEmail', user.email || '');
        localStorage.setItem('userRole', user.role || '');
        
        // Return user data with token
        return {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            token
        };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const fetchUserProfile = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });
        
        const data = await handleResponse(response);
        
        // Update localStorage with latest user data
        localStorage.setItem('userName', data.full_name || data.username);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', data.role);
        
        return {
            id: data.user_id,
            username: data.username,
            full_name: data.full_name,
            email: data.email,
            role: data.role,
            phone_number: data.phone_number,
            address: data.address,
            is_active: data.is_active
        };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Forgot password error:', error);
        throw error;
    }
};

export const resetPassword = async (token, newPassword) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, newPassword })
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Reset password error:', error);
        throw error;
    }
};