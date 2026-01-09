/**
 * UI Helper Functions
 * Reusable utilities for DOM manipulation and formatting
 */

/**
 * Create an HTML table element
 * @param {Array<string>} headers - Table header labels
 * @param {Array<Array<string>>} rows - Table rows data
 * @param {string} className - CSS class name for the table
 * @returns {HTMLTableElement}
 */
function createTable(headers, rows, className = '') {
    const table = document.createElement('table');
    if (className) {
        table.className = className;
    }

    // Create header
    if (headers && headers.length > 0) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);
    }

    // Create body
    const tbody = document.createElement('tbody');
    rows.forEach(rowData => {
        const row = document.createElement('tr');

        rowData.forEach(cellData => {
            const td = document.createElement('td');
            td.innerHTML = cellData; // Allow HTML in cells
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Create a colored badge element
 * @param {string} text - Badge text
 * @param {string} type - Badge type (success, error, warning, info)
 * @returns {HTMLSpanElement}
 */
function createBadge(text, type = 'info') {
    const badge = document.createElement('span');
    badge.className = `badge badge-${type}`;
    badge.textContent = text;

    // Inline styles for badges
    badge.style.cssText = `
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 600;
        ${getBadgeColor(type)}
    `;

    return badge;
}

/**
 * Get badge color based on type
 * @param {string} type - Badge type
 * @returns {string} CSS color styles
 */
function getBadgeColor(type) {
    const colors = {
        success: 'background: #10b981; color: white;',
        error: 'background: #ef4444; color: white;',
        warning: 'background: #f59e0b; color: white;',
        info: 'background: #3b82f6; color: white;',
    };
    return colors[type] || colors.info;
}

/**
 * Create a section header
 * @param {string} title - Header title
 * @param {string} subtitle - Optional subtitle
 * @returns {HTMLDivElement}
 */
function createSectionHeader(title, subtitle = '') {
    const header = document.createElement('div');
    header.className = 'section-header';
    header.style.cssText = 'margin-bottom: 1rem;';

    const h3 = document.createElement('h3');
    h3.textContent = title;
    h3.style.cssText = 'font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-primary);';
    header.appendChild(h3);

    if (subtitle) {
        const p = document.createElement('p');
        p.textContent = subtitle;
        p.style.cssText = 'color: var(--text-secondary); font-size: 0.875rem;';
        header.appendChild(p);
    }

    return header;
}

/**
 * Create a code block element
 * @param {string} code - Code to display
 * @param {string} language - Language for syntax highlighting hint
 * @returns {HTMLPreElement}
 */
function createCodeBlock(code, language = '') {
    const pre = document.createElement('pre');
    pre.style.cssText = `
        background: #282a36;
        color: #f8f8f2;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        font-family: 'Fira Code', 'Consolas', monospace;
        font-size: 0.875rem;
        line-height: 1.6;
    `;

    const codeEl = document.createElement('code');
    if (language) {
        codeEl.className = `language-${language}`;
    }
    codeEl.textContent = code;

    pre.appendChild(codeEl);
    return pre;
}

/**
 * Create an info box
 * @param {string} message - Message to display
 * @param {string} type - Type (success, error, warning, info)
 * @returns {HTMLDivElement}
 */
function createInfoBox(message, type = 'info') {
    const box = document.createElement('div');
    box.className = `info-box info-box-${type}`;

    const colors = {
        success: 'background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; color: #10b981;',
        error: 'background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; color: #ef4444;',
        warning: 'background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; color: #f59e0b;',
        info: 'background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; color: #3b82f6;',
    };

    box.style.cssText = `
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
        ${colors[type] || colors.info}
    `;

    box.textContent = message;
    return box;
}

/**
 * Format a number with commas for readability
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Create a tree structure element (for AST display)
 * @param {string} label - Node label
 * @param {number} depth - Indentation depth
 * @returns {HTMLDivElement}
 */
function createTreeNode(label, depth = 0) {
    const node = document.createElement('div');
    node.className = 'tree-node';
    node.style.cssText = `
        padding-left: ${depth * 1.5}rem;
        padding: 0.25rem;
        font-family: 'Fira Code', 'Consolas', monospace;
        font-size: 0.875rem;
        color: var(--text-primary);
    `;

    // Add indentation markers
    if (depth > 0) {
        const indent = '│  '.repeat(depth - 1) + '├─ ';
        const indentSpan = document.createElement('span');
        indentSpan.textContent = indent;
        indentSpan.style.color = 'var(--text-muted)';
        node.appendChild(indentSpan);
    }

    const labelSpan = document.createElement('span');
    labelSpan.textContent = label;
    node.appendChild(labelSpan);

    return node;
}

/**
 * Clear all children from an element
 * @param {HTMLElement} element - Element to clear
 */
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Append multiple children to an element
 * @param {HTMLElement} parent - Parent element
 * @param {Array<HTMLElement>} children - Child elements to append
 */
function appendChildren(parent, children) {
    children.forEach(child => {
        if (child) {
            parent.appendChild(child);
        }
    });
}

/**
 * Create a simple key-value pair display
 * @param {string} key - Key name
 * @param {string} value - Value
 * @returns {HTMLDivElement}
 */
function createKeyValue(key, value) {
    const container = document.createElement('div');
    container.style.cssText = 'margin: 0.5rem 0;';

    const keySpan = document.createElement('span');
    keySpan.textContent = key + ': ';
    keySpan.style.cssText = 'color: var(--text-secondary); font-weight: 600;';

    const valueSpan = document.createElement('span');
    valueSpan.textContent = value;
    valueSpan.style.cssText = 'color: var(--text-primary);';

    container.appendChild(keySpan);
    container.appendChild(valueSpan);

    return container;
}

// Log that UI helpers are loaded
console.log('UI Helpers loaded ✓');
