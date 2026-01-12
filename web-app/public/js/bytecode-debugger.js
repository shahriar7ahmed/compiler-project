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

        // Add CSS animations - Phase 5.5.3
        this.addAnimations();

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
     * Add CSS animations - Phase 5.5.3
     */
    addAnimations() {
        // Check if style already exists
        if (document.getElementById('bytecode-debugger-animations')) return;

        const style = document.createElement('style');
        style.id = 'bytecode-debugger-animations';
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.2); }
            }
            
            @keyframes slideIn {
                from { opacity: 0; transform: translateX(-10px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes stackPush {
                from { opacity: 0; transform: translateY(20px) scale(0.8); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            
            @keyframes stackPop {
                from { opacity: 1; transform: scale(1); }
                to { opacity: 0; transform: scale(0.8) translateY(-20px); }
            }
            
            @keyframes varChange {
                0% { background: rgba(16, 185, 129, 0.3); }
                100% { background: var(--bg-tertiary); }
            }
        `;
        document.head.appendChild(style);
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

            // Add click handlers - Phase 5.5.2
            if (btn.id === 'play-btn') {
                button.addEventListener('click', () => this.play());
            } else if (btn.id === 'pause-btn') {
                button.addEventListener('click', () => this.pause());
            } else if (btn.id === 'stop-btn') {
                button.addEventListener('click', () => this.stop());
            } else if (btn.id === 'step-btn') {
                button.addEventListener('click', () => this.stepForward());
            } else if (btn.id === 'reset-btn') {
                button.addEventListener('click', () => this.reset());
            }

            btnContainer.appendChild(button);
        });

        panel.appendChild(btnContainer);

        // Speed control - Phase 5.5.2
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

        const speedButtons = document.createElement('div');
        speedButtons.style.cssText = `
            display: flex;
            gap: 0.5rem;
        `;

        ['slow', 'normal', 'fast'].forEach(speed => {
            const btn = document.createElement('button');
            btn.textContent = speed.charAt(0).toUpperCase() + speed.slice(1);
            btn.style.cssText = `
                flex: 1;
                padding: 0.5rem;
                background: ${speed === 'normal' ? 'var(--accent-primary)' : 'var(--bg-tertiary)'};
                color: ${speed === 'normal' ? 'white' : 'var(--text-secondary)'};
                border: none;
                border-radius: 0.375rem;
                cursor: pointer;
                font-size: 0.813rem;
                transition: all 0.2s;
            `;

            btn.addEventListener('click', () => {
                // Update active state
                speedButtons.querySelectorAll('button').forEach(b => {
                    b.style.background = 'var(--bg-tertiary)';
                    b.style.color = 'var(--text-secondary)';
                });
                btn.style.background = 'var(--accent-primary)';
                btn.style.color = 'white';

                this.setSpeed(speed);
            });

            speedButtons.appendChild(btn);
        });

        speedControl.appendChild(speedLabel);
        speedControl.appendChild(speedButtons);
        panel.appendChild(speedControl);

        // Initialize button states
        this.updateButtonStates();

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
     * Update instruction highlight - Phase 5.5.3 enhanced
     */
    updateInstructionHighlight() {
        const instructionList = document.getElementById('instruction-list');
        const instructions = instructionList ? instructionList.querySelectorAll('div[data-index]') : [];

        instructions.forEach((instr, index) => {
            const dataIndex = parseInt(instr.dataset.index);

            // Remove all previous styling
            instr.style.background = 'transparent';
            instr.style.borderLeft = 'none';
            instr.style.fontWeight = '400';
            instr.style.transform = 'scale(1)';
            instr.style.boxShadow = 'none';
            instr.style.opacity = '1'; // Reset opacity
            instr.style.transition = 'none'; // Reset transition

            // Remove instruction pointer if exists
            const existingPointer = instr.querySelector('.instruction-pointer');
            if (existingPointer) {
                existingPointer.remove();
            }

            // Current instruction - Phase 5.5.3
            if (dataIndex === this.currentInstruction) {
                instr.style.background = 'linear-gradient(90deg, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.1))';
                instr.style.borderLeft = '4px solid var(--accent-primary)';
                instr.style.fontWeight = '700';
                instr.style.transform = 'scale(1.02)';
                instr.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.3)';
                instr.style.transition = 'all 0.3s ease';

                // Add instruction pointer indicator - Phase 5.5.3
                const pointer = document.createElement('span');
                pointer.className = 'instruction-pointer';
                pointer.textContent = '▶';
                pointer.style.cssText = `
                    position: absolute;
                    left: -20px;
                    color: var(--accent-primary);
                    font-size: 1rem;
                    animation: pulse 1s infinite;
                `;
                instr.style.position = 'relative';
                instr.insertBefore(pointer, instr.firstChild);

                // Scroll to current instruction - Phase 5.5.3
                this.scrollToInstruction(dataIndex);
            }
            // Next instruction preview - Phase 5.5.3
            else if (dataIndex === this.currentInstruction + 1) {
                instr.style.background = 'rgba(99, 102, 241, 0.05)';
                instr.style.borderLeft = '2px solid rgba(99, 102, 241, 0.3)';
            }
            // Previous instruction - Phase 5.5.3
            else if (dataIndex === this.currentInstruction - 1) {
                instr.style.background = 'rgba(107, 114, 128, 0.05)';
                instr.style.borderLeft = '2px solid rgba(107, 114, 128, 0.3)';
            }
            // Executed instructions - Phase 5.5.3
            else if (dataIndex < this.currentInstruction) {
                instr.style.opacity = '0.6';
            }
        });
    }

    /**
     * Scroll to current instruction - Phase 5.5.3
     */
    scrollToInstruction(index) {
        const instructionList = document.getElementById('instruction-list');
        if (!instructionList) return;

        const instruction = instructionList.querySelector(`div[data-index="${index}"]`);
        if (!instruction) return;

        // Smooth scroll with center alignment
        instruction.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
    }

    /**
     * Execute single instruction - Phase 5.5.2
     */
    executeInstruction() {
        if (this.currentInstruction >= this.bytecode.length - 1) {
            this.stop();
            console.log('Program execution completed');
            return false;
        }

        this.currentInstruction++;
        const instr = this.bytecode[this.currentInstruction];

        // Save state for history
        this.executionHistory.push({
            instruction: this.currentInstruction,
            stack: [...this.stack],
            variables: { ...this.variables }
        });

        // Execute instruction
        try {
            switch (instr.opcode) {
                case 'LOAD_CONST':
                    this.stack.push(instr.operand);
                    break;

                case 'LOAD_VAR':
                    if (this.variables[instr.variable] !== undefined) {
                        this.stack.push(this.variables[instr.variable]);
                    } else {
                        throw new Error(`Variable '${instr.variable}' not defined`);
                    }
                    break;

                case 'STORE_VAR':
                    if (this.stack.length === 0) {
                        throw new Error('Stack underflow');
                    }
                    this.variables[instr.variable] = this.stack.pop();
                    break;

                case 'ADD':
                    if (this.stack.length < 2) {
                        throw new Error('Stack underflow');
                    }
                    const b = this.stack.pop();
                    const a = this.stack.pop();
                    this.stack.push(a + b);
                    break;

                case 'SUB':
                    if (this.stack.length < 2) {
                        throw new Error('Stack underflow');
                    }
                    const sb = this.stack.pop();
                    const sa = this.stack.pop();
                    this.stack.push(sa - sb);
                    break;

                case 'MUL':
                    if (this.stack.length < 2) {
                        throw new Error('Stack underflow');
                    }
                    const mb = this.stack.pop();
                    const ma = this.stack.pop();
                    this.stack.push(ma * mb);
                    break;

                case 'DIV':
                    if (this.stack.length < 2) {
                        throw new Error('Stack underflow');
                    }
                    const db = this.stack.pop();
                    const da = this.stack.pop();
                    if (db === 0) {
                        throw new Error('Division by zero');
                    }
                    this.stack.push(Math.floor(da / db));
                    break;

                case 'PRINT':
                    // For now, just log to console
                    if (this.stack.length > 0) {
                        console.log('OUTPUT:', this.stack[this.stack.length - 1]);
                    }
                    break;

                case 'HALT':
                    this.stop();
                    return false;

                default:
                    console.warn('Unknown opcode:', instr.opcode);
            }

            this.updateUI();
            return true;
        } catch (error) {
            console.error('Execution error:', error.message);
            this.stop();
            return false;
        }
    }

    /**
     * Play - auto-execute instructions - Phase 5.5.2
     */
    play() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.updateButtonStates();

        this.intervalId = setInterval(() => {
            const canContinue = this.executeInstruction();
            if (!canContinue) {
                this.stop();
            }
        }, this.speed);
    }

    /**
     * Pause execution - Phase 5.5.2
     */
    pause() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.updateButtonStates();
    }

    /**
     * Stop and reset - Phase 5.5.2
     */
    stop() {
        this.pause();
        this.updateButtonStates();
    }

    /**
     * Step forward (single instruction) - Phase 5.5.2
     */
    stepForward() {
        if (this.isRunning) {
            this.pause();
        }
        this.executeInstruction();
    }

    /**
     * Step backward (undo last instruction) - Phase 5.5.2
     */
    stepBackward() {
        if (this.isRunning) {
            this.pause();
        }

        if (this.executionHistory.length === 0) {
            console.log('Cannot step back - at beginning');
            return;
        }

        const prevState = this.executionHistory.pop();
        this.currentInstruction = prevState.instruction - 1;
        this.stack = prevState.stack;
        this.variables = prevState.variables;

        this.updateUI();
    }

    /**
     * Set execution speed - Phase 5.5.2
     */
    setSpeed(speedName) {
        const speeds = {
            'slow': 1000,
            'normal': 500,
            'fast': 100
        };

        this.speed = speeds[speedName] || 500;

        // Update label
        const speedLabel = document.getElementById('speed-value');
        if (speedLabel) {
            speedLabel.textContent = speedName.charAt(0).toUpperCase() + speedName.slice(1);
        }

        // If currently playing, restart with new speed
        if (this.isRunning) {
            this.pause();
            this.play();
        }
    }

    /**
     * Update button states - Phase 5.5.2
     */
    updateButtonStates() {
        const playBtn = document.getElementById('play-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const stopBtn = document.getElementById('stop-btn');
        const stepBtn = document.getElementById('step-btn');
        const resetBtn = document.getElementById('reset-btn');

        if (this.isRunning) {
            if (playBtn) playBtn.disabled = true;
            if (pauseBtn) pauseBtn.disabled = false;
            if (stepBtn) stepBtn.disabled = true;
        } else {
            if (playBtn) playBtn.disabled = false;
            if (pauseBtn) pauseBtn.disabled = true;
            if (stepBtn) stepBtn.disabled = false;
        }

        // Add disabled styling
        [playBtn, pauseBtn, stopBtn, stepBtn, resetBtn].forEach(btn => {
            if (btn && btn.disabled) {
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            } else if (btn) {
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
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
