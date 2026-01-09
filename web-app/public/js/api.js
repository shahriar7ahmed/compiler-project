/**
 * API Communication Layer
 * Handles all HTTP requests to the backend server
 */

/**
 * Compile source code
 * @param {string} sourceCode - The source code to compile
 * @returns {Promise<Object>} Compilation result with tokens, AST, bytecode, etc.
 * @throws {Error} If compilation fails or network error occurs
 */
async function compileCode(sourceCode) {
    try {
        const response = await fetch(`${API_BASE_URL}/compile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sourceCode }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Compilation error:', error);
        throw new Error(`Failed to compile: ${error.message}`);
    }
}

/**
 * Get list of available demo files
 * @returns {Promise<Array>} Array of demo objects with name and description
 * @throws {Error} If request fails
 */
async function getDemos() {
    try {
        const response = await fetch(`${API_BASE_URL}/demos`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.demos || [];
    } catch (error) {
        console.error('Error fetching demos:', error);
        throw new Error(`Failed to load demos: ${error.message}`);
    }
}

/**
 * Load a specific demo file
 * @param {string} filename - Name of the demo file to load
 * @returns {Promise<string>} Content of the demo file
 * @throws {Error} If demo file not found or request fails
 */
async function loadDemo(filename) {
    try {
        const response = await fetch(`${API_BASE_URL}/demo/${filename}`, {
            method: 'GET',
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Demo file not found');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.content || '';
    } catch (error) {
        console.error('Error loading demo:', error);
        throw new Error(`Failed to load demo: ${error.message}`);
    }
}

/**
 * Helper function to make fetch requests with timeout
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds (default: 10000ms)
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}

// Log API initialization
console.log('API Layer initialized. Base URL:', API_BASE_URL);
