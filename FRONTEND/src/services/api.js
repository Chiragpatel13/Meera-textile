// Use the proxy configuration from package.json
// No need to specify the full URL as it will be proxied

// Simulated API responses
const SIMULATED_DELAY = 1500;

export const login = async (credentials) => {
    try {
        console.log('Simulated login with:', credentials);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
        
        // Simulate successful login
        return {
            token: 'simulated-jwt-token',
            user: {
                username: credentials.username,
                role: 'STORE_MANAGER'
            }
        };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const fetchUserProfile = async () => {
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
        
        // Simulate user profile data
        return {
            username: 'Admin User',
            email: 'admin@miratextile.com',
            role: 'STORE_MANAGER'
        };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const forgotPassword = async (email) => {
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
        
        // Simulate successful password reset request
        return {
            message: 'Password reset instructions have been sent to your email.'
        };
    } catch (error) {
        console.error('Forgot password error:', error);
        throw error;
    }
}; 