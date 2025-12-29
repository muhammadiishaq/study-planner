import API_BASE_URL from '../config/api';

// Auth Service - Handles all authentication API calls

class AuthService {
  // Signup new user
  async signup(name, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL.auth}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Save token and user info to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Network error. Please check if backend is running.' };
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL.auth}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Save token and user info to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please check if backend is running.' };
    }
  }

  // Update user's diploma level
  async updateLevel(selectedLevel) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return { success: false, message: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL.auth}/level`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ selectedLevel }),
      });

      const data = await response.json();

      if (data.success) {
        // Update user info in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('selectedDiploma', selectedLevel);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Update level error:', error);
      return { success: false, message: 'Network error. Please check if backend is running.' };
    }
  }

  // Get current user info
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return { success: false, message: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL.auth}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Get user error:', error);
      return { success: false, message: 'Network error. Please check if backend is running.' };
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedDiploma');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Get stored user info
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new AuthService();
