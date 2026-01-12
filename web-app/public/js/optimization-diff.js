/**
 * Optimization Diff Visualizer - Phase 5.4.1
 * Side-by-side comparison of pre/post optimization AST
 */

class OptimizationDiff {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.beforeAST = null;
        this.afterAST = null;
        this.optimizationCount = 0;
    }

    /**
     * Initialize the comparison view - Phase 5.4.1
     */
    init() {
        if (!this.container) {
            console.error('Container not found:', this.containerId);
            return false;
        }

        // Clear existing content
        this.container.innerHTML = '';

        // Create main layout
        this.container.style.cssText = `
            background: var(--bg-secondary);
            border-radius: 0.5rem;
            padding: 1.5rem;
            min-height: 500px;
        `;

        return true;
    }

    /**
     * Clone AST for comparison - Phase 5.4.1
     */
    cloneAST(ast) {
        if (!ast) return null;
        return JSON.parse(JSON.stringify(ast));
    }

    /**
     * Render side-by-side comparison - Phase 5.4.1
     */
    render(beforeAST, afterAST, optimizationCount = 0) {
        if (!this.init()) {
            console.error('Failed to initialize comparison view');
            return;
        }

        this.beforeAST = this.cloneAST(beforeAST);
        this.afterAST = this.cloneAST(afterAST);
        this.optimizationCount = optimizationCount;

        // Create header with toggle
        this.createHeader();

        // Create side-by-side containers
        this.createComparisonContainers();

        // Render both ASTs
        this.renderBeforeAST();
        this.renderAfterAST();

        console.log('✓ Optimization comparison rendered');
    }

    /**
     * Create header with view toggle - Phase 5.4.1
     */
    createHeader() {
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--bg-tertiary);
        `;

        const title = document.createElement('h3');
        title.textContent = '🔄 Optimization Comparison';
        title.style.cssText = `
            color: var(--text-primary);
            margin: 0;
            font-size: 1.25rem;
        `;

        const badge = document.createElement('span');
        badge.textContent = `${this.optimizationCount} optimization${this.optimizationCount !== 1 ? 's' : ''}`;
        badge.style.cssText = `
            background: var(--success);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-weight: 600;
            font-size: 0.875rem;
        `;

        header.appendChild(title);
        header.appendChild(badge);
        this.container.appendChild(header);
    }

    /**
     * Create side-by-side containers - Phase 5.4.1
     */
    createComparisonContainers() {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        `;

        // Before container
        const beforeContainer = document.createElement('div');
        beforeContainer.id = `${this.containerId}-before`;
        beforeContainer.style.cssText = `
            background: var(--bg-primary);
            border-radius: 0.5rem;
            padding: 1rem;
            border: 2px solid #ef4444;
        `;

        const beforeLabel = document.createElement('div');
        beforeLabel.textContent = '📋 Before Optimization';
        beforeLabel.style.cssText = `
            font-weight: 700;
            color: #ef4444;
            margin-bottom: 1rem;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;

        beforeContainer.insertBefore(beforeLabel, beforeContainer.firstChild);

        // After container
        const afterContainer = document.createElement('div');
        afterContainer.id = `${this.containerId}-after`;
        afterContainer.style.cssText = `
            background: var(--bg-primary);
            border-radius: 0.5rem;
            padding: 1rem;
            border: 2px solid #10b981;
        `;

        const afterLabel = document.createElement('div');
        afterLabel.textContent = '✨ After Optimization';
        afterLabel.style.cssText = `
            font-weight: 700;
            color: #10b981;
            margin-bottom: 1rem;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;

        afterContainer.insertBefore(afterLabel, afterContainer.firstChild);

        wrapper.appendChild(beforeContainer);
        wrapper.appendChild(afterContainer);
        this.container.appendChild(wrapper);

        this.beforeContainer = beforeContainer;
        this.afterContainer = afterContainer;
    }

    /**
     * Render before AST - Phase 5.4.1
     */
    renderBeforeAST() {
        if (!this.beforeAST || this.beforeAST.length === 0) {
            this.beforeContainer.innerHTML += '<div style="color: var(--text-muted); font-style: italic;">No AST data</div>';
            return;
        }

        const treeView = document.createElement('div');
        treeView.style.cssText = `
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 0.875rem;
            line-height: 1.6;
            color: var(--text-secondary);
            overflow-x: auto;
            max-height: 600px;
            overflow-y: auto;
        `;

        this.beforeAST.forEach((node, index) => {
            this.renderASTNode(node, 0, treeView, 'before');
        });

        this.beforeContainer.appendChild(treeView);
    }

    /**
     * Render after AST - Phase 5.4.1
     */
    renderAfterAST() {
        if (!this.afterAST || this.afterAST.length === 0) {
            this.afterContainer.innerHTML += '<div style="color: var(--text-muted); font-style: italic;">No AST data</div>';
            return;
        }

        const treeView = document.createElement('div');
        treeView.style.cssText = `
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 0.875rem;
            line-height: 1.6;
            color: var(--text-secondary);
            overflow-x: auto;
            max-height: 600px;
            overflow-y: auto;
        `;

        this.afterAST.forEach((node, index) => {
            this.renderASTNode(node, 0, treeView, 'after');
        });

        this.afterContainer.appendChild(treeView);
    }

    /**
     * Render single AST node recursively - Phase 5.4.1
     */
    renderASTNode(node, depth, container, context) {
        if (!node) return;

        const indent = '  '.repeat(depth);
        const nodeDiv = document.createElement('div');
        nodeDiv.style.cssText = `
            padding-left: ${depth * 20}px;
            margin: 4px 0;
        `;

        const nodeType = document.createElement('span');
        nodeType.textContent = node.type || 'Unknown';
        nodeType.style.cssText = `
            color: #61afef;
            font-weight: 600;
        `;

        const nodeDetails = this.getNodeDetails(node);
        const detailsSpan = document.createElement('span');
        detailsSpan.textContent = nodeDetails ? ` ${nodeDetails}` : '';
        detailsSpan.style.color = '#98c379';

        nodeDiv.appendChild(nodeType);
        nodeDiv.appendChild(detailsSpan);
        container.appendChild(nodeDiv);

        // Recursively render children
        if (node.thenBlock && node.thenBlock.length > 0) {
            node.thenBlock.forEach(child => this.renderASTNode(child, depth + 1, container, context));
        }
        if (node.elseBlock && node.elseBlock.length > 0) {
            node.elseBlock.forEach(child => this.renderASTNode(child, depth + 1, container, context));
        }
        if (node.body && node.body.length > 0) {
            node.body.forEach(child => this.renderASTNode(child, depth + 1, container, context));
        }
        if (node.expression) {
            this.renderASTNode(node.expression, depth + 1, container, context);
        }
        if (node.condition) {
            this.renderASTNode(node.condition, depth + 1, container, context);
        }
        if (node.left) {
            this.renderASTNode(node.left, depth + 1, container, context);
        }
        if (node.right) {
            this.renderASTNode(node.right, depth + 1, container, context);
        }
    }

    /**
     * Get node details for display
     */
    getNodeDetails(node) {
        if (node.identifier) return `(${node.identifier})`;
        if (node.value !== undefined) return `(${node.value})`;
        if (node.operator) return `(${node.operator})`;
        if (node.variable) return `(${node.variable})`;
        return '';
    }

    /**
     * Clear the visualization
     */
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.OptimizationDiff = OptimizationDiff;
}

console.log('Optimization Diff Visualizer loaded (Phase 5.4.1) ✓');
