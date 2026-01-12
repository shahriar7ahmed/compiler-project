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

        // Calculate diff - Phase 5.4.2
        this.diffResult = this.calculateDiff(this.beforeAST, this.afterAST);

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
     * Calculate diff between before and after AST - Phase 5.4.2
     */
    calculateDiff(beforeAST, afterAST) {
        const diff = {
            eliminated: [],
            optimized: [],
            unchanged: [],
            matches: new Map()
        };

        // Simple node matching based on type and position
        const beforeFlat = this.flattenAST(beforeAST);
        const afterFlat = this.flattenAST(afterAST);

        // Match nodes
        beforeFlat.forEach((beforeNode, beforeIdx) => {
            let matched = false;

            afterFlat.forEach((afterNode, afterIdx) => {
                if (this.nodesMatch(beforeNode, afterNode)) {
                    diff.matches.set(beforeIdx, afterIdx);

                    // Check if optimized
                    if (this.isOptimized(beforeNode, afterNode)) {
                        diff.optimized.push(beforeIdx);
                    } else {
                        diff.unchanged.push(beforeIdx);
                    }
                    matched = true;
                }
            });

            if (!matched) {
                diff.eliminated.push(beforeIdx);
            }
        });

        return diff;
    }

    /**
     * Flatten AST to linear array - Phase 5.4.2
     */
    flattenAST(ast) {
        const flat = [];

        const traverse = (node) => {
            if (!node) return;
            flat.push(node);

            if (node.thenBlock) node.thenBlock.forEach(traverse);
            if (node.elseBlock) node.elseBlock.forEach(traverse);
            if (node.body) node.body.forEach(traverse);
            if (node.expression) traverse(node.expression);
            if (node.condition) traverse(node.condition);
            if (node.left) traverse(node.left);
            if (node.right) traverse(node.right);
        };

        if (Array.isArray(ast)) {
            ast.forEach(traverse);
        } else {
            traverse(ast);
        }

        return flat;
    }

    /**
     * Check if two nodes match - Phase 5.4.2
     */
    nodesMatch(node1, node2) {
        if (node1.type !== node2.type) return false;

        // Check key properties
        if (node1.identifier !== node2.identifier) return false;
        if (node1.operator !== node2.operator) return false;
        if (node1.variable !== node2.variable) return false;

        return true;
    }

    /**
     * Check if node was optimized - Phase 5.4.2
     */
    isOptimized(beforeNode, afterNode) {
        // Check if constant folding occurred
        if (beforeNode.type === 'BinaryOperation' && afterNode.type === 'IntegerLiteral') {
            return true;
        }

        // Check if value changed
        if (beforeNode.value !== afterNode.value) {
            return true;
        }

        return false;
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
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--bg-tertiary);
            flex-wrap: wrap;
            gap: 1rem;
        `;

        const titleSection = document.createElement('div');
        titleSection.style.display = 'flex';
        titleSection.style.alignItems = 'center';
        titleSection.style.gap = '1rem';

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

        titleSection.appendChild(title);
        titleSection.appendChild(badge);

        // Add diff legend - Phase 5.4.2
        const legend = this.createDiffLegend();

        header.appendChild(titleSection);
        header.appendChild(legend);
        this.container.appendChild(header);
    }

    /**
     * Create diff legend - Phase 5.4.2
     */
    createDiffLegend() {
        const legend = document.createElement('div');
        legend.style.cssText = `
            display: flex;
            gap: 1rem;
            align-items: center;
            font-size: 0.875rem;
        `;

        const legendItems = [
            { label: 'Eliminated', color: '#ef4444', icon: '🗑️' },
            { label: 'Optimized', color: '#10b981', icon: '✨' },
            { label: 'Unchanged', color: '#6b7280', icon: '➖' }
        ];

        legendItems.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.style.cssText = `
                display: flex;
                align-items: center;
                gap: 0.5rem;
            `;

            const icon = document.createElement('span');
            icon.textContent = item.icon;

            const indicator = document.createElement('div');
            indicator.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: ${item.color};
            `;

            const label = document.createElement('span');
            label.textContent = item.label;
            label.style.color = 'var(--text-secondary)';

            legendItem.appendChild(icon);
            legendItem.appendChild(indicator);
            legendItem.appendChild(label);
            legend.appendChild(legendItem);
        });

        return legend;
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
     * Render single AST node recursively - Phase 5.4.2 updated
     */
    renderASTNode(node, depth, container, context) {
        if (!node) return;

        const nodeDiv = document.createElement('div');
        nodeDiv.style.cssText = `
            padding-left: ${depth * 20}px;
            margin: 4px 0;
            padding: 4px 8px;
            border-radius: 4px;
            transition: background 0.2s;
        `;

        // Add hover effect
        nodeDiv.addEventListener('mouseenter', () => {
            nodeDiv.style.background = 'rgba(99, 102, 241, 0.1)';
        });
        nodeDiv.addEventListener('mouseleave', () => {
            nodeDiv.style.background = 'transparent';
        });

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

        // Apply diff highlighting - Phase 5.4.2
        if (this.diffResult && context === 'before') {
            const flatIdx = this.getNodeIndex(node);

            if (this.diffResult.eliminated.includes(flatIdx)) {
                nodeDiv.style.background = 'rgba(239, 68, 68, 0.15)';
                nodeDiv.style.borderLeft = '3px solid #ef4444';

                const badge = document.createElement('span');
                badge.textContent = ' 🗑️';
                badge.style.marginLeft = '8px';
                badge.title = 'Eliminated';
                nodeDiv.appendChild(badge);
            } else if (this.diffResult.optimized.includes(flatIdx)) {
                nodeDiv.style.background = 'rgba(16, 185, 129, 0.15)';
                nodeDiv.style.borderLeft = '3px solid #10b981';

                const badge = document.createElement('span');
                badge.textContent = ' ✨';
                badge.style.marginLeft = '8px';
                badge.title = 'Optimized';
                nodeDiv.appendChild(badge);
            } else if (this.diffResult.unchanged.includes(flatIdx)) {
                nodeDiv.style.background = 'rgba(107, 114, 128, 0.1)';
                nodeDiv.style.borderLeft = '3px solid #6b7280';
            }
        }

        nodeDiv.insertBefore(nodeType, nodeDiv.firstChild);
        if (detailsSpan.textContent) {
            nodeDiv.insertBefore(detailsSpan, nodeDiv.children[1]);
        }
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
     * Get node index in flattened AST - Phase 5.4.2
     */
    getNodeIndex(node) {
        // Simple implementation - in production would need better tracking
        const flat = this.flattenAST(this.beforeAST);
        return flat.findIndex(n =>
            n.type === node.type &&
            n.identifier === node.identifier &&
            n.value === node.value &&
            n.operator === node.operator
        );
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
