// Security Management System - Main JavaScript Functions

// Common utility functions used across all pages

/**
 * Display a message to the user
 * @param {string} text - Message text
 * @param {string} type - Message type (success/error)
 */
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

/**
 * Format date to locale string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

/**
 * Get severity badge class
 * @param {string} severity - Severity level
 * @returns {string} CSS class name
 */
function getSeverityBadge(severity) {
    return `badge-${severity.toLowerCase()}`;
}

/**
 * Get status badge class
 * @param {string} status - Status value
 * @returns {string} CSS class name
 */
function getStatusBadge(status) {
    return `badge-${status.toLowerCase().replace(' ', '-')}`;
}

/**
 * Check if user is logged in
 * @returns {object|null} User object or null
 */
function checkAuth() {
    const user = sessionStorage.getItem('user');
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(user);
}

/**
 * Logout user
 */
function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showMessage,
        formatDate,
        getSeverityBadge,
        getStatusBadge,
        checkAuth,
        logout
    };
}

