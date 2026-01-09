/**
 * Stage Rendering Functions
 * Displays compilation results for each of the 6 stages
 */

/**
 * Main rendering dispatcher
 * @param {number} stageNum - Stage number (1-6)
 * @param {Object} data - Compilation data
 */
function renderStage(stageNum, data) {
    const stageContent = document.getElementById('stage-content');
    if (!stageContent) {
        console.error('Stage content element not found');
        return;
    }

    // Clear previous content
    stageContent.innerHTML = '';

    // Render the appropriate stage
    switch (stageNum) {
        case 1:
            renderTokens(data.tokens);
            break;
        case 2:
            renderAST(data.ast);
            break;
        case 3:
            renderSemantic(data);
            break;
        case 4:
            renderOptimization(data);
            break;
        case 5:
            renderBytecode(data.bytecode);
            break;
        case 6:
            renderExecution(data);
            break;
        default:
            stageContent.innerHTML = '<p>Unknown stage</p>';
    }
}

// ============================================
// STAGE 1: Lexical Analysis (Tokens)
// ============================================
function renderTokens(tokens) {
    const stageContent = document.getElementById('stage-content');

    // Add header
    const header = createSectionHeader(
        'Stage 1: Lexical Analysis',
        'Breaking down source code into tokens'
    );
    stageContent.appendChild(header);

    if (!tokens || tokens.length === 0) {
        const noTokens = createInfoBox('No tokens found', 'warning');
        stageContent.appendChild(noTokens);
        return;
    }

    // Create token count info
    const info = createKeyValue('Total Tokens', tokens.length.toString());
    stageContent.appendChild(info);

    // Create tokens table
    const headers = ['#', 'Type', 'Value', 'Location'];
    const rows = tokens.map((token, index) => {
        const typeBadge = `<span style="background: var(--accent-primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">${escapeHtml(token.type)}</span>`;
        const location = `${token.line}:${token.column}`;

        return [
            (index + 1).toString(),
            typeBadge,
            `<code style="background: var(--bg-tertiary); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">${escapeHtml(token.value)}</code>`,
            location
        ];
    });

    const table = createTable(headers, rows);

    // Style the table
    table.style.cssText = `
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
        background: var(--bg-secondary);
        border-radius: 0.5rem;
        overflow: hidden;
    `;

    // Style table headers
    const ths = table.querySelectorAll('th');
    ths.forEach(th => {
        th.style.cssText = `
            background: var(--bg-tertiary);
            padding: 0.75rem;
            text-align: left;
            font-weight: 600;
            color: var(--text-primary);
            border-bottom: 2px solid var(--bg-hover);
        `;
    });

    // Style table cells
    const tds = table.querySelectorAll('td');
    tds.forEach(td => {
        td.style.cssText = `
            padding: 0.75rem;
            border-bottom: 1px solid var(--bg-tertiary);
            color: var(--text-primary);
        `;
    });

    stageContent.appendChild(table);

    // Add token type summary
    const typeSummary = document.createElement('div');
    typeSummary.style.cssText = 'margin-top: 1.5rem;';

    const summaryHeader = document.createElement('h4');
    summaryHeader.textContent = 'Token Type Summary';
    summaryHeader.style.cssText = 'color: var(--text-primary); margin-bottom: 0.5rem;';
    typeSummary.appendChild(summaryHeader);

    // Count token types
    const typeCounts = {};
    tokens.forEach(token => {
        typeCounts[token.type] = (typeCounts[token.type] || 0) + 1;
    });

    // Display counts
    Object.entries(typeCounts).forEach(([type, count]) => {
        const countItem = createKeyValue(type, `${count} occurrence${count > 1 ? 's' : ''}`);
        typeSummary.appendChild(countItem);
    });

    stageContent.appendChild(typeSummary);
}

// ============================================
// STAGE 2: Syntax Analysis (AST)
// ============================================
function renderAST(ast) {
    const stageContent = document.getElementById('stage-content');

    // Add header
    const header = createSectionHeader(
        'Stage 2: Syntax Analysis',
        'Abstract Syntax Tree representation'
    );
    stageContent.appendChild(header);

    if (!ast || ast.length === 0) {
        const noAST = createInfoBox('No AST nodes found', 'warning');
        stageContent.appendChild(noAST);
        return;
    }

    // Create AST info
    const info = createKeyValue('Total Statements', ast.length.toString());
    stageContent.appendChild(info);

    // Create tree container
    const treeContainer = document.createElement('div');
    treeContainer.style.cssText = `
        background: var(--bg-secondary);
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin-top: 1rem;
        font-family: 'Fira Code', 'Consolas', monospace;
        overflow-x: auto;
    `;

    // Add program root
    const programNode = createTreeNode('Program', 0);
    programNode.style.fontWeight = '700';
    programNode.style.color = 'var(--accent-primary)';
    treeContainer.appendChild(programNode);

    // Render each statement in AST
    ast.forEach((node, index) => {
        renderASTNode(node, 1, treeContainer, index === ast.length - 1);
    });

    stageContent.appendChild(treeContainer);
}

/**
 * Recursively render an AST node
 * @param {Object} node - AST node
 * @param {number} depth - Tree depth
 * @param {HTMLElement} container - Container element
 * @param {boolean} isLast - Whether this is the last node at this level
 */
function renderASTNode(node, depth, container, isLast = false) {
    if (!node) return;

    const nodeType = node.type || 'Unknown';
    let nodeLabel = nodeType;

    // Add node-specific information
    if (node.type === 'LetStatement') {
        nodeLabel = `LetStatement (${node.identifier || 'unnamed'})`;
    } else if (node.type === 'PrintStatement') {
        nodeLabel = 'PrintStatement';
    } else if (node.type === 'IntegerLiteral') {
        nodeLabel = `IntegerLiteral (${node.value})`;
    } else if (node.type === 'Identifier') {
        nodeLabel = `Identifier (${node.name})`;
    } else if (node.type === 'BinaryOperation') {
        nodeLabel = `BinaryOp (${node.operator})`;
    }

    const treeNode = createTreeNode(nodeLabel, depth);

    // Color code different node types
    const colors = {
        'LetStatement': 'var(--info)',
        'PrintStatement': 'var(--success)',
        'IntegerLiteral': 'var(--warning)',
        'Identifier': 'var(--accent-light)',
        'BinaryOperation': 'var(--text-primary)',
    };

    const color = colors[nodeType] || 'var(--text-secondary)';
    treeNode.style.color = color;

    container.appendChild(treeNode);

    // Render child nodes
    if (node.expression) {
        renderASTNode(node.expression, depth + 1, container);
    }

    if (node.value && typeof node.value === 'object') {
        renderASTNode(node.value, depth + 1, container);
    }

    if (node.left) {
        renderASTNode(node.left, depth + 1, container);
    }

    if (node.right) {
        renderASTNode(node.right, depth + 1, container, true);
    }
}

// Placeholder functions for remaining stages (will be implemented in Parts 2 & 3)
function renderSemantic(data) {
    const stageContent = document.getElementById('stage-content');
    stageContent.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">Stage 3: Semantic Analysis renderer coming in Part 2...</div>';
}

function renderOptimization(data) {
    const stageContent = document.getElementById('stage-content');
    stageContent.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">Stage 4: Optimization renderer coming in Part 2...</div>';
}

function renderBytecode(bytecode) {
    const stageContent = document.getElementById('stage-content');
    stageContent.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">Stage 5: Bytecode renderer coming in Part 3...</div>';
}

function renderExecution(data) {
    const stageContent = document.getElementById('stage-content');
    stageContent.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">Stage 6: Execution renderer coming in Part 3...</div>';
}

function renderErrors(data) {
    const stageContent = document.getElementById('stage-content');
    stageContent.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--error);">Error renderer coming in Part 3...</div>';
}

console.log('Stage Renderers loaded (Part 1: Stages 1-2) ✓');
