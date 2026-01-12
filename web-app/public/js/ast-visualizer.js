/**
 * AST Visualizer - Phase 5.3.1
 * Interactive D3.js tree visualization for Abstract Syntax Trees
 */

class ASTVisualizer {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.svg = null;
        this.g = null;
        this.tree = null;
        this.root = null;
        this.currentZoom = 1;

        // Dimensions
        this.width = 0;
        this.height = 0;
        this.nodeWidth = 160;
        this.nodeHeight = 60;
        this.verticalSpacing = 100;
        this.horizontalSpacing = 200;

        // Colors (matching syntax highlighter)
        this.colors = {
            'LetStatement': '#e06c75',        // Red
            'PrintStatement': '#98c379',      // Green
            'IfStatement': '#e5c07b',         // Yellow
            'ForStatement': '#c678dd',        // Purple
            'IntegerLiteral': '#d19a66',      // Orange
            'Identifier': '#61afef',          // Blue
            'BinaryOperation': '#56b6c2',     // Cyan
            'ComparisonExpression': '#56b6c2',
            'LogicalExpression': '#98c379',
            'UnaryExpression': '#e5c07b',
            'Program': '#abb2bf',             // Light gray
            'default': '#abb2bf'
        };
    }

    /**
     * Initialize the SVG container
     */
    init() {
        if (!this.container) {
            console.error('Container not found:', this.containerId);
            return false;
        }

        // Clear existing content
        this.container.innerHTML = '';

        // Get container dimensions
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width || 800;
        this.height = rect.height || 600;

        // Create SVG
        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', [0, 0, this.width, this.height])
            .style('background', '#1e1e2e')
            .style('border-radius', '0.5rem');

        // Create main group for zoom/pan
        this.g = this.svg.append('g')
            .attr('class', 'tree-group');

        // Setup zoom behavior - Phase 5.3.3
        this.setupZoom();

        // Add zoom controls - Phase 5.3.3
        this.addZoomControls();

        return true;
    }

    /**
     * Setup zoom and pan behavior - Phase 5.3.3
     */
    setupZoom() {
        const minZoom = 0.1;
        const maxZoom = 3;

        this.zoom = d3.zoom()
            .scaleExtent([minZoom, maxZoom])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
                this.currentZoom = event.transform.k;
            });

        this.svg.call(this.zoom);
    }

    /**
     * Add zoom control buttons - Phase 5.3.3
     */
    addZoomControls() {
        // Create controls container
        const controls = d3.select(`#${this.containerId}`)
            .append('div')
            .attr('class', 'ast-zoom-controls')
            .style('position', 'absolute')
            .style('top', '10px')
            .style('right', '10px')
            .style('display', 'flex')
            .style('flex-direction', 'column')
            .style('gap', '8px')
            .style('z-index', '10');

        // Zoom in button
        controls.append('button')
            .attr('class', 'zoom-btn zoom-in')
            .html('➕')
            .style('width', '40px')
            .style('height', '40px')
            .style('background', '#4a5568')
            .style('color', 'white')
            .style('border', 'none')
            .style('border-radius', '8px')
            .style('cursor', 'pointer')
            .style('font-size', '18px')
            .style('transition', 'all 0.2s')
            .on('mouseover', function () {
                d3.select(this).style('background', '#6366f1');
            })
            .on('mouseout', function () {
                d3.select(this).style('background', '#4a5568');
            })
            .on('click', () => this.zoomIn());

        // Zoom out button
        controls.append('button')
            .attr('class', 'zoom-btn zoom-out')
            .html('➖')
            .style('width', '40px')
            .style('height', '40px')
            .style('background', '#4a5568')
            .style('color', 'white')
            .style('border', 'none')
            .style('border-radius', '8px')
            .style('cursor', 'pointer')
            .style('font-size', '18px')
            .style('transition', 'all 0.2s')
            .on('mouseover', function () {
                d3.select(this).style('background', '#6366f1');
            })
            .on('mouseout', function () {
                d3.select(this).style('background', '#4a5568');
            })
            .on('click', () => this.zoomOut());

        // Reset/Fit button
        controls.append('button')
            .attr('class', 'zoom-btn zoom-reset')
            .html('⟲')
            .style('width', '40px')
            .style('height', '40px')
            .style('background', '#4a5568')
            .style('color', 'white')
            .style('border', 'none')
            .style('border-radius', '8px')
            .style('cursor', 'pointer')
            .style('font-size', '20px')
            .style('transition', 'all 0.2s')
            .on('mouseover', function () {
                d3.select(this).style('background', '#10b981');
            })
            .on('mouseout', function () {
                d3.select(this).style('background', '#4a5568');
            })
            .on('click', () => this.resetZoom());
    }

    /**
     * Zoom in - Phase 5.3.3
     */
    zoomIn() {
        this.svg.transition()
            .duration(350)
            .call(this.zoom.scaleBy, 1.3);
    }

    /**
     * Zoom out - Phase 5.3.3
     */
    zoomOut() {
        this.svg.transition()
            .duration(350)
            .call(this.zoom.scaleBy, 0.7);
    }

    /**
     * Reset zoom to fit entire tree - Phase 5.3.3
     */
    resetZoom() {
        this.centerTree();
    }

    /**
     * Convert compiler AST to D3 hierarchy format
     * @param {Array} ast - AST from compiler
     * @returns {Object} D3 hierarchy root
     */
    convertASTToHierarchy(ast) {
        if (!ast || ast.length === 0) {
            return null;
        }

        // Create root node
        const root = {
            name: 'Program',
            type: 'Program',
            children: []
        };

        // Process each statement
        ast.forEach(node => {
            root.children.push(this.processNode(node));
        });

        return root;
    }

    /**
     * Process a single AST node recursively
     * @param {Object} node - AST node
     * @returns {Object} D3 node
     */
    processNode(node) {
        if (!node) return null;

        const d3Node = {
            name: this.getNodeLabel(node),
            type: node.type || 'Unknown',
            data: node,
            children: []
        };

        // Process different node types
        if (node.type === 'LetStatement') {
            if (node.expression) {
                d3Node.children.push(this.processNode(node.expression));
            }
        } else if (node.type === 'PrintStatement') {
            if (node.expression) {
                d3Node.children.push(this.processNode(node.expression));
            }
        } else if (node.type === 'IfStatement') {
            if (node.condition) {
                d3Node.children.push({
                    name: 'Condition',
                    type: 'Label',
                    children: [this.processNode(node.condition)]
                });
            }
            if (node.thenBlock && node.thenBlock.length > 0) {
                const thenNode = {
                    name: 'Then Block',
                    type: 'Block',
                    children: node.thenBlock.map(stmt => this.processNode(stmt))
                };
                d3Node.children.push(thenNode);
            }
            if (node.elseBlock && node.elseBlock.length > 0) {
                const elseNode = {
                    name: 'Else Block',
                    type: 'Block',
                    children: node.elseBlock.map(stmt => this.processNode(stmt))
                };
                d3Node.children.push(elseNode);
            }
        } else if (node.type === 'ForStatement') {
            if (node.body && node.body.length > 0) {
                const bodyNode = {
                    name: 'Body',
                    type: 'Block',
                    children: node.body.map(stmt => this.processNode(stmt))
                };
                d3Node.children.push(bodyNode);
            }
        } else if (node.type === 'BinaryOperation' || node.type === 'ComparisonExpression' || node.type === 'LogicalExpression') {
            if (node.left) {
                d3Node.children.push(this.processNode(node.left));
            }
            if (node.right) {
                d3Node.children.push(this.processNode(node.right));
            }
        } else if (node.type === 'UnaryExpression') {
            if (node.operand) {
                d3Node.children.push(this.processNode(node.operand));
            }
        }

        return d3Node;
    }

    /**
     * Get a descriptive label for a node
     * @param {Object} node - AST node
     * @returns {string} Node label
     */
    getNodeLabel(node) {
        if (!node || !node.type) return 'Unknown';

        switch (node.type) {
            case 'LetStatement':
                return `let ${node.identifier || '?'}`;
            case 'PrintStatement':
                return 'print';
            case 'IfStatement':
                return 'if';
            case 'ForStatement':
                return `for ${node.variable || '?'}`;
            case 'IntegerLiteral':
                return `${node.value}`;
            case 'Identifier':
                return node.name || '?';
            case 'BinaryOperation':
                return node.operator || '?';
            case 'ComparisonExpression':
                return node.operator || '?';
            case 'LogicalExpression':
                return node.operator || '?';
            case 'UnaryExpression':
                return node.operator || '?';
            default:
                return node.type;
        }
    }

    /**
     * Render the tree
     * @param {Array} ast - AST array from compiler
     */
    render(ast) {
        if (!this.init()) {
            console.error('Failed to initialize visualizer');
            return;
        }

        // Convert AST to hierarchy
        const hierarchyData = this.convertASTToHierarchy(ast);
        if (!hierarchyData) {
            console.error('Failed to convert AST to hierarchy');
            return;
        }

        // Create D3 hierarchy
        this.root = d3.hierarchy(hierarchyData);

        // Create tree layout
        this.tree = d3.tree()
            .size([this.width - 100, this.height - 100])
            .separation((a, b) => (a.parent === b.parent ? 1 : 1.2));

        // Apply tree layout
        const treeData = this.tree(this.root);

        // Draw links with curved paths - Phase 5.3.2
        this.g.selectAll('.link')
            .data(treeData.links())
            .join('path')
            .attr('class', 'link')
            .attr('d', d => {
                // Create smooth curved path
                const sourceX = d.source.x;
                const sourceY = d.source.y;
                const targetX = d.target.x;
                const targetY = d.target.y;

                return `M${sourceX},${sourceY}
                        C${sourceX},${(sourceY + targetY) / 2}
                         ${targetX},${(sourceY + targetY) / 2}
                         ${targetX},${targetY}`;
            })
            .attr('fill', 'none')
            .attr('stroke', d => {
                const color = this.colors[d.target.data.type] || this.colors.default;
                return color + '44'; // Add transparency
            })
            .attr('stroke-width', 2.5)
            .attr('stroke-opacity', 0.6)
            .style('transition', 'stroke 0.3s ease');

        // Draw nodes
        const nodes = this.g.selectAll('.node')
            .data(treeData.descendants())
            .join('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .style('cursor', 'pointer');

        // Add node shapes based on type - Phase 5.3.2
        nodes.each(function (d) {
            const node = d3.select(this);
            const color = d.parent ?
                (this.colors[d.data.type] || this.colors.default) :
                '#6366f1'; // Root node special color

            const nodeType = d.data.type;
            const isLiteral = nodeType.includes('Literal');
            const isStatement = nodeType.includes('Statement');
            const isExpression = nodeType.includes('Expression') || nodeType.includes('Operation');

            // Different shapes for different node types
            if (isLiteral) {
                // Circles for literals
                node.append('circle')
                    .attr('r', 20)
                    .attr('fill', color)
                    .attr('stroke', '#1a202c')
                    .attr('stroke-width', 2.5)
                    .style('filter', 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 12px ' + color + '55)');
            } else if (isStatement || nodeType === 'Program') {
                // Rounded rectangles for statements
                node.append('rect')
                    .attr('x', -35)
                    .attr('y', -20)
                    .attr('width', 70)
                    .attr('height', 40)
                    .attr('rx', 8)
                    .attr('ry', 8)
                    .attr('fill', color)
                    .attr('stroke', '#1a202c')
                    .attr('stroke-width', 2.5)
                    .style('filter', 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 12px ' + color + '55)');
            } else if (isExpression) {
                // Diamonds for expressions/operations
                node.append('path')
                    .attr('d', 'M 0,-25 L 30,0 L 0,25 L -30,0 Z')
                    .attr('fill', color)
                    .attr('stroke', '#1a202c')
                    .attr('stroke-width', 2.5)
                    .style('filter', 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 12px ' + color + '55)');
            } else {
                // Default: ellipse for other types
                node.append('ellipse')
                    .attr('rx', 30)
                    .attr('ry', 20)
                    .attr('fill', color)
                    .attr('stroke', '#1a202c')
                    .attr('stroke-width', 2.5)
                    .style('filter', 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 12px ' + color + '55)');
            }

            // Add hover effect
            node.on('mouseenter', function () {
                d3.select(this).select('circle, rect, path, ellipse')
                    .transition()
                    .duration(200)
                    .attr('stroke-width', 4)
                    .style('filter', 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 20px ' + color + '88)');
            })
                .on('mouseleave', function () {
                    d3.select(this).select('circle, rect, path, ellipse')
                        .transition()
                        .duration(200)
                        .attr('stroke-width', 2.5)
                        .style('filter', 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 12px ' + color + '55)');
                });
        }.bind(this));

        // Add labels with text wrapping - Phase 5.3.2
        nodes.append('text')
            .attr('dy', '0.31em')
            .attr('text-anchor', 'middle')
            .attr('fill', '#ffffff')
            .attr('font-size', '13px')
            .attr('font-weight', '700')
            .attr('pointer-events', 'none')
            .attr('text-shadow', '0 1px 3px rgba(0, 0, 0, 0.8)')
            .each(function (d) {
                const text = d3.select(this);
                const name = d.data.name;

                // Smart text wrapping
                if (name.length > 10) {
                    const words = name.split(' ');
                    if (words.length > 1) {
                        // Multi-word: split into lines
                        text.text('');
                        text.append('tspan')
                            .attr('x', 0)
                            .attr('dy', '-0.3em')
                            .text(words[0]);
                        text.append('tspan')
                            .attr('x', 0)
                            .attr('dy', '1.2em')
                            .text(words.slice(1).join(' ').substring(0, 8) + (words.slice(1).join(' ').length > 8 ? '..' : ''));
                    } else {
                        // Single long word: truncate
                        text.text(name.substring(0, 10) + '..');
                    }
                } else {
                    text.text(name);
                }
            });

        // Add type labels below nodes - Phase 5.3.2
        nodes.append('text')
            .attr('dy', '3.2em')
            .attr('text-anchor', 'middle')
            .attr('fill', '#cbd5e0')
            .attr('font-size', '10px')
            .attr('font-style', 'italic')
            .attr('pointer-events', 'none')
            .attr('opacity', 0.8)
            .text(d => {
                const type = d.data.type;
                // Shorten type names
                return type.replace('Statement', '').replace('Expression', 'Expr').replace('Operation', 'Op');
            });

        // Center the tree
        this.centerTree();

        console.log('✓ AST tree rendered with', this.root.descendants().length, 'nodes');
    }

    /**
     * Center the tree in the viewport - Phase 5.3.3 updated
     */
    centerTree() {
        if (!this.root) return;

        const bounds = this.g.node().getBBox();
        const fullWidth = this.width;
        const fullHeight = this.height;
        const width = bounds.width;
        const height = bounds.height;
        const midX = bounds.x + width / 2;
        const midY = bounds.y + height / 2;

        const scale = 0.9 / Math.max(width / fullWidth, height / fullHeight);
        const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

        // Use zoom transform for smooth animation
        const transform = d3.zoomIdentity
            .translate(translate[0], translate[1])
            .scale(scale);

        this.svg.transition()
            .duration(750)
            .call(this.zoom.transform, transform);

        this.currentZoom = scale;
    }

    /**
     * Clear the visualization
     */
    clear() {
        if (this.svg) {
            this.svg.remove();
            this.svg = null;
        }
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ASTVisualizer = ASTVisualizer;
}

console.log('AST Visualizer loaded (Phase 5.3.1) ✓');
