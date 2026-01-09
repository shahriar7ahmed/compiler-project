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

// ============================================
// STAGE 3: Semantic Analysis
// ============================================
function renderSemantic(data) {
    const stageContent = document.getElementById('stage-content');

    // Add header
    const header = createSectionHeader(
        'Stage 3: Semantic Analysis',
        'Variable declaration checking and semantic validation'
    );
    stageContent.appendChild(header);

    // Check if there are errors
    if (!data.success) {
        // Render errors if compilation failed at semantic stage
        if (data.stage === 'semantic' && data.errors) {
            const errorBox = createInfoBox(
                `Semantic Error: ${data.errors[0]?.message || 'Unknown error'}`,
                'error'
            );
            stageContent.appendChild(errorBox);

            // Show error details
            if (data.errors[0]) {
                const errorDetails = createKeyValue('Location', `Line ${data.errors[0].line}, Column ${data.errors[0].column}`);
                stageContent.appendChild(errorDetails);
            }
            return;
        }
    }

    // Success - no semantic errors
    const successBox = createInfoBox(
        '✓ No semantic errors found! All variables are properly declared.',
        'success'
    );
    stageContent.appendChild(successBox);

    // Display symbol table (extract from AST)
    const variables = extractVariablesFromAST(data.ast || []);

    if (variables.length > 0) {
        const symbolHeader = document.createElement('h4');
        symbolHeader.textContent = 'Symbol Table';
        symbolHeader.style.cssText = 'color: var(--text-primary); margin: 1.5rem 0 1rem 0; font-size: 1.125rem;';
        stageContent.appendChild(symbolHeader);

        const headers = ['Variable', 'Type', 'Line'];
        const rows = variables.map(v => [
            `<code style="background: var(--bg-tertiary); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">${escapeHtml(v.name)}</code>`,
            createBadge('Integer', 'info').outerHTML,
            v.line.toString()
        ]);

        const table = createTable(headers, rows);

        // Style the table
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            background: var(--bg-secondary);
            border-radius: 0.5rem;
            overflow: hidden;
        `;

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

        const tds = table.querySelectorAll('td');
        tds.forEach(td => {
            td.style.cssText = `
                padding: 0.75rem;
                border-bottom: 1px solid var(--bg-tertiary);
                color: var(--text-primary);
            `;
        });

        stageContent.appendChild(table);
    }

    // Summary
    const summary = document.createElement('div');
    summary.style.cssText = 'margin-top: 1.5rem; padding: 1rem; background: var(--bg-secondary); border-radius: 0.5rem;';

    const summaryTitle = document.createElement('h4');
    summaryTitle.textContent = 'Analysis Summary';
    summaryTitle.style.cssText = 'color: var(--text-primary); margin-bottom: 0.75rem;';
    summary.appendChild(summaryTitle);

    summary.appendChild(createKeyValue('Variables Declared', variables.length.toString()));
    summary.appendChild(createKeyValue('Semantic Errors', '0'));
    summary.appendChild(createKeyValue('Status', '✓ Ready for optimization'));

    stageContent.appendChild(summary);
}

/**
 * Extract variable declarations from AST
 * @param {Array} ast - AST nodes
 * @returns {Array} Variables with name and line
 */
function extractVariablesFromAST(ast) {
    const variables = [];

    ast.forEach((node, index) => {
        if (node.type === 'LetStatement' && node.identifier) {
            variables.push({
                name: node.identifier,
                line: index + 1  // Approximation
            });
        }
    });

    return variables;
}

// ============================================
// STAGE 4: Optimization
// ============================================
function renderOptimization(data) {
    const stageContent = document.getElementById('stage-content');

    // Add header
    const header = createSectionHeader(
        'Stage 4: Code Optimization',
        'Compile-time optimizations and improvements'
    );
    stageContent.appendChild(header);

    const optimizationCount = data.optimizations || 0;

    // Optimization count display
    const countBox = document.createElement('div');
    countBox.style.cssText = `
        background: var(--bg-secondary);
        padding: 1.5rem;
        border-radius: 0.75rem;
        text-align: center;
        margin: 1rem 0;
        border: 2px solid var(--accent-primary);
    `;

    const countNumber = document.createElement('div');
    countNumber.textContent = optimizationCount.toString();
    countNumber.style.cssText = `
        font-size: 3rem;
        font-weight: 700;
        color: var(--accent-primary);
        margin-bottom: 0.5rem;
    `;
    countBox.appendChild(countNumber);

    const countLabel = document.createElement('div');
    countLabel.textContent = `Optimization${optimizationCount !== 1 ? 's' : ''} Applied`;
    countLabel.style.cssText = 'color: var(--text-secondary); font-size: 1.125rem;';
    countBox.appendChild(countLabel);

    stageContent.appendChild(countBox);

    // Optimization details
    if (optimizationCount > 0) {
        const infoBox = createInfoBox(
            '✓ Code has been optimized! Constant expressions were evaluated at compile-time.',
            'success'
        );
        stageContent.appendChild(infoBox);

        // Optimization types
        const typesContainer = document.createElement('div');
        typesContainer.style.cssText = 'margin: 1.5rem 0;';

        const typesHeader = document.createElement('h4');
        typesHeader.textContent = 'Optimizations Performed';
        typesHeader.style.cssText = 'color: var(--text-primary); margin-bottom: 1rem;';
        typesContainer.appendChild(typesHeader);

        // List of optimization types
        const optimizations = [
            {
                name: 'Constant Folding',
                description: 'Evaluating constant expressions at compile time',
                applied: optimizationCount > 0
            },
            {
                name: 'Dead Code Elimination',
                description: 'Removing unreachable code',
                applied: false
            }
        ];

        optimizations.forEach(opt => {
            const optItem = document.createElement('div');
            optItem.style.cssText = `
                padding: 1rem;
                background: var(--bg-secondary);
                border-radius: 0.5rem;
                margin-bottom: 0.75rem;
                border-left: 4px solid ${opt.applied ? 'var(--success)' : 'var(--bg-hover)'};
            `;

            const optName = document.createElement('div');
            optName.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;';

            const badge = createBadge(opt.applied ? 'Applied' : 'Not Applied', opt.applied ? 'success' : 'info');
            optName.appendChild(badge);

            const nameText = document.createElement('span');
            nameText.textContent = opt.name;
            nameText.style.cssText = 'font-weight: 600; color: var(--text-primary);';
            optName.appendChild(nameText);

            optItem.appendChild(optName);

            const optDesc = document.createElement('div');
            optDesc.textContent = opt.description;
            optDesc.style.cssText = 'color: var(--text-secondary); font-size: 0.875rem;';
            optItem.appendChild(optDesc);

            typesContainer.appendChild(optItem);
        });

        stageContent.appendChild(typesContainer);

        // Performance impact
        const impactBox = document.createElement('div');
        impactBox.style.cssText = `
            background: var(--bg-secondary);
            padding: 1.5rem;
            border-radius: 0.5rem;
            margin-top: 1.5rem;
        `;

        const impactHeader = document.createElement('h4');
        impactHeader.textContent = 'Performance Impact';
        impactHeader.style.cssText = 'color: var(--text-primary); margin-bottom: 1rem;';
        impactBox.appendChild(impactHeader);

        impactBox.appendChild(createKeyValue('Execution Speed', '↑ Faster (constants pre-computed)'));
        impactBox.appendChild(createKeyValue('Code Size', '↓ Smaller (fewer instructions)'));
        impactBox.appendChild(createKeyValue('Runtime Efficiency', '↑ Improved'));

        stageContent.appendChild(impactBox);

    } else {
        const noOptBox = createInfoBox(
            'No optimizations were applied. The code is already optimal.',
            'info'
        );
        stageContent.appendChild(noOptBox);
    }
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

console.log('Stage Renderers loaded (Parts 1-2: Stages 1-4) ✓');
