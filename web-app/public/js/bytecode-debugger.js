/**
 * Bytecode Debugger - Phase 5.5.1
 * Interactive step-through debugger for VM bytecode execution
 */

class BytecodeDebugger {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.bytecode = [];
        this.currentInstruction = -1;
        this.stack = [];
        this.variables = {};
        this.executionHistory = [];
        this.isRunning = false;
        this.speed = 1000; // ms between instructions (slow)
        this.intervalId = null;
    }

    /**
     * Initialize debugger UI - Phase 5.5.1
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
            padding: 1rem;
            min-height: 600px;
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 1rem;
        `;

        // Create left panel (bytecode + controls)
        this.leftPanel = document.createElement('div');
        this.leftPanel.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 1rem;
        `;

        // Create right panel (VM state)
        this.rightPanel = document.createElement('div');
        this.rightPanel.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 1rem;
        `;

        this.container.appendChild(this.leftPanel);
        this.container.appendChild(this.rightPanel);

        return true;
    }

    /**
     * Load bytecode for debugging - Phase 5.5.1
     */
    load(bytecode) {
        if (!this.init()) {
            console.error('Failed to initialize debugger');
            return;
        }

        this.bytecode = bytecode || [];
        this.reset();

        // Create UI components
        this.createControlPanel();
        this.createBytecodeView();
        this.createStackVisualization();
        this.createVariableTable();

        console.log('✓ Bytecode debugger loaded with', this.bytecode.length, 'instructions');
    }

    /**
     * Create control panel - Phase 5.5.1
     */
    createControlPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            background: var(--bg-primary);
            padding: 1rem;
            border-radius: 0.5rem;
            border: 2px solid var(--accent-primary);
        `;

        const title = document.createElement('h4');
        title.textContent = '🎮 Debugger Controls';
        title.style.cssText = `
            color: var(--text-primary);
            margin: 0 0 1rem 0;
            font-size: 1.125rem;
        `;
        panel.appendChild(title);

        // Button container
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = `
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        `;

        // Control buttons (will be implemented in Phase 5.5.2)
        const buttons = [
            { icon: '▶️', label: 'Play', id: 'play-btn', color: '#10b981' },
            { icon: '⏸️', label: 'Pause', id: 'pause-btn', color: '#f59e0b' },
            { icon: '⏹️', label: 'Stop', id: 'stop-btn', color: '#ef4444' },
            { icon: '⏭️', label: 'Step', id: 'step-btn', color: '#6366f1' },
            { icon: '↩️', label: 'Reset', id: 'reset-btn', color: '#8b5cf6' }
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.id = btn.id;
            button.innerHTML = `${btn.icon} <span>${btn.label}</span>`;
            button.style.cssText = `
                padding: 0.625rem 1rem;
                background: ${btn.color};
                color: white;
                border: none;
                border-radius: 0.5rem;
                cursor: pointer;
                font-weight: 600;
                font-size: 0.875rem;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            `;

            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            });

            btnContainer.appendChild(button);
        });

        panel.appendChild(btnContainer);

        // Speed control (will be implemented in Phase 5.5.2)
        const speedControl = document.createElement('div');
        speedControl.style.cssText = `
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid var(--bg-tertiary);
        `;

        const speedLabel = document.createElement('div');
        speedLabel.style.cssText = `
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
        `;
        speedLabel.innerHTML = '<strong>Speed:</strong> <span id="speed-value">Normal</span>';

        speedControl.appendChild(speedLabel);
        panel.appendChild(speedControl);

        this.leftPanel.appendChild(panel);
    }

    /**
     * Create bytecode view - Phase 5.5.1
     */
    createBytecodeView() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            background: var(--bg-primary);
            padding: 1rem;
            border-radius: 0.5rem;
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;

        const title = document.createElement('h4');
        title.textContent = '📝 Bytecode Instructions';
        title.style.cssText = `
            color: var(--text-primary);
            margin: 0 0 1rem 0;
            font-size: 1.125rem;
        `;
        panel.appendChild(title);

        const instructionList = document.createElement('div');
        instructionList.id = 'instruction-list';
        instructionList.style.cssText = `
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 0.875rem;
            overflow-y: auto;
            flex: 1;
        `;

        // Render instructions
        this.bytecode.forEach((instr, index) => {
            const instrDiv = document.createElement('div');
            instrDiv.dataset.index = index;
            instrDiv.style.cssText = `
                padding: 0.5rem 0.75rem;
                margin: 2px 0;
                border-radius: 0.375rem;
                display: flex;
                gap: 1rem;
                align-items: center;
                transition: all 0.2s;
                cursor: pointer;
            `;

            const address = document.createElement('span');
            address.textContent = index.toString().padStart(3, '0');
            address.style.cssText = `
                color: var(--text-muted);
                min-width: 40px;
            `;

            const opcode = document.createElement('span');
            opcode.textContent = instr.opcode;
            opcode.style.cssText = `
                color: #61afef;
                font-weight: 600;
                min-width: 100px;
            `;

            const operand = document.createElement('span');
            operand.textContent = instr.operand !== undefined ? instr.operand :
                instr.variable || '';
            operand.style.cssText = `
                color: #98c379;
            `;

            instrDiv.appendChild(address);
            instrDiv.appendChild(opcode);
            instrDiv.appendChild(operand);

            instrDiv.addEventListener('mouseenter', () => {
                instrDiv.style.background = 'rgba(99, 102, 241, 0.1)';
            });

            instrDiv.addEventListener('mouseleave', () => {
                if (index !== this.currentInstruction) {
                    instrDiv.style.background = 'transparent';
                }
            });

            instructionList.appendChild(instrDiv);
        });

        panel.appendChild(instructionList);
        this.leftPanel.appendChild(panel);
    }

    /**
     * Create stack visualization - Phase 5.5.1
     */
    createStackVisualization() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            background: var(--bg-primary);
            padding: 1rem;
            border-radius: 0.5rem;
            border: 2px solid #f59e0b;
        `;

        const title = document.createElement('h4');
        title.textContent = '📚 Stack';
        title.style.cssText = `
            color: var(--text-primary);
            margin: 0 0 1rem 0;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;

        const stackSize = document.createElement('span');
        stackSize.id = 'stack-size';
        stackSize.textContent = '0 items';
        stackSize.style.cssText = `
            color: #f59e0b;
            font-size: 0.875rem;
            font-weight: 600;
        `;
        title.appendChild(stackSize);

        panel.appendChild(title);

        const stackContainer = document.createElement('div');
        stackContainer.id = 'stack-container';
        stackContainer.style.cssText = `
            display: flex;
            flex-direction: column-reverse;
            gap: 0.5rem;
            min-height: 100px;
            max-height: 300px;
            overflow-y: auto;
            padding: 0.5rem;
            background: var(--bg-secondary);
            border-radius: 0.375rem;
        `;

        const emptyMsg = document.createElement('div');
        emptyMsg.id = 'stack-empty';
        emptyMsg.textContent = 'Stack is empty';
        emptyMsg.style.cssText = `
            color: var(--text-muted);
            font-style: italic;
            text-align: center;
            padding: 2rem 0;
        `;
        stackContainer.appendChild(emptyMsg);

        panel.appendChild(stackContainer);
        this.rightPanel.appendChild(panel);
    }

    /**
     * Create variable table - Phase 5.5.1
     */
    createVariableTable() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            background: var(--bg-primary);
            padding: 1rem;
            border-radius: 0.5rem;
            border: 2px solid #10b981;
        `;

        const title = document.createElement('h4');
        title.textContent = '🔢 Variables';
        title.style.cssText = `
            color: var(--text-primary);
            margin: 0 0 1rem 0;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;

        const varCount = document.createElement('span');
        varCount.id = 'var-count';
        varCount.textContent = '0 vars';
        varCount.style.cssText = `
            color: #10b981;
            font-size: 0.875rem;
            font-weight: 600;
        `;
        title.appendChild(varCount);

        panel.appendChild(title);

        const varContainer = document.createElement('div');
        varContainer.id = 'variable-container';
        varContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            min-height: 100px;
            max-height: 200px;
            overflow-y: auto;
        `;

        const emptyMsg = document.createElement('div');
        emptyMsg.id = 'vars-empty';
        emptyMsg.textContent = 'No variables defined';
        emptyMsg.style.cssText = `
            color: var(--text-muted);
            font-style: italic;
            text-align: center;
            padding: 2rem 0;
        `;
        varContainer.appendChild(emptyMsg);

        panel.appendChild(varContainer);
        this.rightPanel.appendChild(panel);
    }

    /**
     * Reset debugger state - Phase 5.5.1
     */
    reset() {
        this.currentInstruction = -1;
        this.stack = [];
        this.variables = {};
        this.executionHistory = [];
        this.isRunning = false;

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.updateUI();
    }

    /**
     * Update UI elements - Phase 5.5.1
     */
    updateUI() {
        this.updateStackView();
        this.updateVariableTable();
        this.updateInstructionHighlight();
    }

    /**
     * Update stack visualization - Phase 5.5.1
     */
    updateStackView() {
        const container = document.getElementById('stack-container');
        const sizeLabel = document.getElementById('stack-size');

        if (!container || !sizeLabel) return;

        container.innerHTML = '';
        sizeLabel.textContent = `${this.stack.length} item${this.stack.length !== 1 ? 's' : ''}`;

        if (this.stack.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.textContent = 'Stack is empty';
            emptyMsg.style.cssText = `
                color: var(--text-muted);
                font-style: italic;
                text-align: center;
                padding: 2rem 0;
            `;
            container.appendChild(emptyMsg);
            return;
        }

        this.stack.forEach((value, index) => {
            const item = document.createElement('div');
            item.style.cssText = `
                background: var(--bg-tertiary);
                padding: 0.75rem;
                border-radius: 0.375rem;
                border-left: 3px solid #f59e0b;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;

            const valueSpan = document.createElement('span');
            valueSpan.textContent = value;
            valueSpan.style.cssText = `
                color: #f59e0b;
                font-weight: 700;
                font-size: 1.125rem;
            `;

            const indexSpan = document.createElement('span');
            indexSpan.textContent = `[${index}]`;
            indexSpan.style.cssText = `
                color: var(--text-muted);
                font-size: 0.75rem;
            `;

            item.appendChild(valueSpan);
            item.appendChild(indexSpan);
            container.appendChild(item);
        });
    }

    /**
     * Update variable table - Phase 5.5.1
     */
    updateVariableTable() {
        const container = document.getElementById('variable-container');
        const countLabel = document.getElementById('var-count');

        if (!container || !countLabel) return;

        const varNames = Object.keys(this.variables);
        container.innerHTML = '';
        countLabel.textContent = `${varNames.length} var${varNames.length !== 1 ? 's' : ''}`;

        if (varNames.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.textContent = 'No variables defined';
            emptyMsg.style.cssText = `
                color: var(--text-muted);
                font-style: italic;
                text-align: center;
                padding: 2rem 0;
            `;
            container.appendChild(emptyMsg);
            return;
        }

        varNames.forEach(name => {
            const row = document.createElement('div');
            row.style.cssText = `
                background: var(--bg-tertiary);
                padding: 0.625rem 0.75rem;
                border-radius: 0.375rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-left: 3px solid #10b981;
            `;

            const nameSpan = document.createElement('span');
            nameSpan.textContent = name;
            nameSpan.style.cssText = `
                color: var(--text-primary);
                font-weight: 600;
                font-family: 'Fira Code', monospace;
            `;

            const valueSpan = document.createElement('span');
            valueSpan.textContent = this.variables[name];
            valueSpan.style.cssText = `
                color: #10b981;
                font-weight: 700;
            `;

            row.appendChild(nameSpan);
            row.appendChild(valueSpan);
            container.appendChild(row);
        });
    }

    /**
     * Update instruction highlight - Phase 5.5.1
     */
    updateInstructionHighlight() {
        const instructions = document.querySelectorAll('#instruction-list > div');

        instructions.forEach((instr, index) => {
            if (index === this.currentInstruction) {
                instr.style.background = 'rgba(99, 102, 241, 0.2)';
                instr.style.borderLeft = '4px solid var(--accent-primary)';
                instr.style.fontWeight = '700';
            } else {
                instr.style.background = 'transparent';
                instr.style.borderLeft = 'none';
                instr.style.fontWeight = '400';
            }
        });
    }

    /**
     * Clear visualization
     */
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.BytecodeDebugger = BytecodeDebugger;
}

console.log('Bytecode Debugger loaded (Phase 5.5.1) ✓');
