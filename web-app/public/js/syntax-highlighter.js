/**
 * Custom Syntax Highlighter for Educational Compiler Language
 * Defines language grammar and highlighting rules using Prism.js
 */

(function () {
    // Define custom language for the educational compiler
    Prism.languages.educompiler = {
        // Comments (if we add them later)
        'comment': /\/\/.*/,

        // String literals (for future use)
        'string': {
            pattern: /"(?:\\.|[^\\"\r\n])*"|'(?:\\.|[^\\'\r\n])*'/,
            greedy: true
        },

        // Keywords - the language's reserved words
        'keyword': /\b(?:let|print|if|else|for|to)\b/,

        // Boolean values
        'boolean': /\b(?:true|false)\b/,

        // Numbers - integers and floats
        'number': /\b\d+(?:\.\d+)?\b/,

        // Operators
        'operator': /[+\-*\/<>=!&|]+|(?:==|!=|<=|>=|&&|\|\|)/,

        // Punctuation - brackets, braces, semicolons
        'punctuation': /[{}[\];(),]/,

        // Identifiers/Variables - anything that's not a keyword
        'variable': /\b[a-zA-Z_]\w*\b/
    };

    // Also create an alias for easier use
    Prism.languages.ec = Prism.languages.educompiler;
})();

/**
 * Highlight source code using Prism.js
 * @param {string} code - Source code to highlight
 * @returns {string} HTML with syntax highlighting
 */
function highlightCode(code) {
    if (!code) return '';

    try {
        return Prism.highlight(code, Prism.languages.educompiler, 'educompiler');
    } catch (error) {
        console.error('Syntax highlighting error:', error);
        return escapeHtml(code);
    }
}

/**
 * Create a syntax-highlighted code block with line numbers
 * @param {string} code - Source code
 * @param {string} language - Language identifier (default: 'educompiler')
 * @returns {HTMLElement} Code block element
 */
function createHighlightedCodeBlock(code, language = 'educompiler') {
    const container = document.createElement('div');
    container.className = 'code-block-container';
    container.style.cssText = `
        background: #1d1f21;
        border-radius: 0.5rem;
        overflow: hidden;
        margin: 1rem 0;
        border: 1px solid var(--bg-hover);
    `;

    const pre = document.createElement('pre');
    pre.className = 'line-numbers';
    pre.style.cssText = `
        margin: 0;
        padding: 0;
        background: transparent;
        overflow-x: auto;
    `;

    const codeElement = document.createElement('code');
    codeElement.className = `language-${language}`;
    codeElement.style.cssText = `
        font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
        font-size: 0.875rem;
        line-height: 1.6;
    `;

    // Split code into lines and add line numbers
    const lines = code.split('\n');
    const numberedCode = lines.map((line, index) => {
        const lineNum = index + 1;
        const lineNumSpan = `<span class="line-number" style="display: inline-block; width: 3em; color: #5c6370; text-align: right; margin-right: 1em; user-select: none;">${lineNum}</span>`;
        const highlightedLine = Prism.highlight(line || ' ', Prism.languages.educompiler, 'educompiler');
        return lineNumSpan + highlightedLine;
    }).join('\n');

    codeElement.innerHTML = numberedCode;
    pre.appendChild(codeElement);
    container.appendChild(pre);

    return container;
}

/**
 * Enhanced token highlighting for the token display
 * Colors tokens based on their type using Prism.js color scheme
 * @param {string} tokenType - Token type (KEYWORD, IDENTIFIER, etc.)
 * @returns {string} CSS color value
 */
function getTokenColor(tokenType) {
    const colorMap = {
        'KEYWORD': '#c678dd',      // Purple (like Prism keywords)
        'IDENTIFIER': '#e06c75',   // Red (like Prism variables)
        'NUMBER': '#d19a66',       // Orange (like Prism numbers)
        'OPERATOR': '#56b6c2',     // Cyan (like Prism operators)
        'LPAREN': '#abb2bf',       // Light gray
        'RPAREN': '#abb2bf',
        'LBRACE': '#abb2bf',
        'RBRACE': '#abb2bf',
        'SEMICOLON': '#abb2bf',
        'ASSIGN': '#56b6c2',       // Cyan
        'COMPARISON': '#56b6c2',   // Cyan
        'COMMA': '#abb2bf',
        'TO': '#c678dd',           // Purple (keyword-like)
        'EOF': '#5c6370',          // Muted gray
    };

    return colorMap[tokenType] || '#abb2bf'; // Default to light gray
}

/**
 * Create an interactive token badge with syntax highlighting colors
 * @param {Object} token - Token object with type and value
 * @param {number} index - Token index
 * @returns {HTMLElement} Token badge element
 */
function createTokenBadge(token, index) {
    const badge = document.createElement('span');
    badge.className = 'token-badge';
    badge.dataset.tokenIndex = index;

    const color = getTokenColor(token.type);
    badge.style.cssText = `
        display: inline-block;
        background: ${color}22;
        color: ${color};
        border: 1px solid ${color}44;
        padding: 0.25rem 0.75rem;
        border-radius: 0.375rem;
        font-size: 0.813rem;
        font-weight: 600;
        font-family: 'Fira Code', monospace;
        margin: 0.25rem;
        cursor: pointer;
        transition: all 0.2s ease;
    `;

    badge.innerHTML = `
        <span style="opacity: 0.7; font-size: 0.7em; margin-right: 0.5em;">${token.type}</span>
        <span>${escapeHtml(token.value)}</span>
    `;

    // Hover effect
    badge.addEventListener('mouseenter', () => {
        badge.style.background = `${color}44`;
        badge.style.borderColor = color;
        badge.style.transform = 'translateY(-1px)';
        badge.style.boxShadow = `0 4px 8px ${color}33`;
    });

    badge.addEventListener('mouseleave', () => {
        badge.style.background = `${color}22`;
        badge.style.borderColor = `${color}44`;
        badge.style.transform = 'translateY(0)';
        badge.style.boxShadow = 'none';
    });

    return badge;
}

/**
 * Highlight source code in the editor (if textarea is available)
 * Creates an overlay with syntax highlighting
 * @param {string} editorId - ID of the textarea element
 */
function highlightEditor(editorId) {
    const editor = document.getElementById(editorId);
    if (!editor) return;

    // Check if overlay already exists
    let overlay = document.getElementById(`${editorId}-overlay`);

    if (!overlay) {
        // Create overlay
        overlay = document.createElement('div');
        overlay.id = `${editorId}-overlay`;
        overlay.className = 'editor-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            padding: ${getComputedStyle(editor).padding};
            font-family: ${getComputedStyle(editor).fontFamily};
            font-size: ${getComputedStyle(editor).fontSize};
            line-height: ${getComputedStyle(editor).lineHeight};
            white-space: pre-wrap;
            word-wrap: break-word;
            color: transparent;
            pointer-events: none;
            overflow: hidden;
            background: transparent;
        `;

        // Wrap editor in a container
        const container = document.createElement('div');
        container.style.position = 'relative';
        editor.parentNode.insertBefore(container, editor);
        container.appendChild(editor);
        container.appendChild(overlay);

        // Make editor transparent for text
        editor.style.background = 'transparent';
        editor.style.position = 'relative';
        editor.style.zIndex = '1';

        // Sync scroll
        editor.addEventListener('scroll', () => {
            overlay.scrollTop = editor.scrollTop;
            overlay.scrollLeft = editor.scrollLeft;
        });

        // Update highlighting on input
        editor.addEventListener('input', () => updateEditorHighlight(editor, overlay));
    }

    // Initial highlight
    updateEditorHighlight(editor, overlay);
}

/**
 * Update editor overlay with highlighted code
 * @param {HTMLElement} editor - Textarea element
 * @param {HTMLElement} overlay - Overlay element
 */
function updateEditorHighlight(editor, overlay) {
    const code = editor.value;
    overlay.innerHTML = highlightCode(code);
}

console.log('Syntax Highlighter loaded with custom educompiler language ✓');
