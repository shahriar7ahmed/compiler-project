/**
 * Main Application Logic
 * Handles state management, event listeners, and coordination between components
 */

// ============================================
// Global State
// ============================================
let currentStage = 1;           // Currently selected stage (1-6)
let compilationData = null;     // Last compilation result
let isCompiling = false;        // Whether compilation is in progress
let availableDemos = [];        // List of available demo files

// ============================================
// DOM Elements
// ============================================
let demoSelector;
let codeEditor;
let compileButton;
let stageTabs;
let stageContent;
let loadingIndicator;

// ============================================
// Initialization
// ============================================
async function init() {
    console.log('Initializing Educational Compiler...');

    // Get DOM elements
    demoSelector = document.getElementById('demo-selector');
    codeEditor = document.getElementById('code-editor');
    compileButton = document.getElementById('compile-btn');
    stageTabs = document.querySelectorAll('.stage-tab');
    stageContent = document.getElementById('stage-content');
    loadingIndicator = document.getElementById('loading-indicator');

    // Set up event listeners
    setupEventListeners();

    // Load demo files
    try {
        await loadDemoList();
        console.log('✓ Demo list loaded');
    } catch (error) {
        console.error('Failed to load demos:', error);
        showError('Failed to load demo files. Please refresh the page.');
    }

    // Initialize syntax highlighting for code editor (if available)
    if (typeof highlightEditor === 'function') {
        // Note: Editor highlighting is optional - uses overlay technique
        console.log('✓ Syntax highlighting available');
    }

    console.log('✓ Educational Compiler initialized successfully!');
}

// ============================================
// Event Listeners Setup
// ============================================
function setupEventListeners() {
    // Demo selector change
    demoSelector.addEventListener('change', handleDemoSelect);

    // Compile button click
    compileButton.addEventListener('click', handleCompile);

    // Stage tab clicks
    stageTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const stageNum = parseInt(tab.dataset.stage);
            handleStageTabClick(stageNum);
        });
    });

    // Code editor keyboard shortcut (Ctrl+Enter to compile)
    codeEditor.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleCompile();
        }
    });
}

// ============================================
// Load Demo List
// ============================================
async function loadDemoList() {
    try {
        availableDemos = await getDemos();

        // Populate dropdown
        demoSelector.innerHTML = '<option value="">-- Select a demo --</option>';

        availableDemos.forEach(demo => {
            const option = document.createElement('option');
            option.value = demo.name;
            option.textContent = `${demo.name} - ${demo.description}`;
            demoSelector.appendChild(option);
        });

    } catch (error) {
        throw error;
    }
}

// ============================================
// Demo Selection Handler
// ============================================
async function handleDemoSelect(event) {
    const selectedDemo = event.target.value;

    if (!selectedDemo) {
        return;
    }

    try {
        showLoading(true);
        const content = await loadDemo(selectedDemo);
        codeEditor.value = content;
        console.log(`✓ Loaded demo: ${selectedDemo}`);
        showLoading(false);
    } catch (error) {
        console.error('Error loading demo:', error);
        showError(`Failed to load demo: ${error.message}`);
        showLoading(false);
    }
}

// ============================================
// Compile Button Handler
// ============================================
async function handleCompile() {
    const sourceCode = codeEditor.value.trim();

    if (!sourceCode) {
        showError('Please enter some code to compile');
        return;
    }

    if (isCompiling) {
        console.log('Compilation already in progress');
        return;
    }

    try {
        isCompiling = true;
        showLoading(true);
        updateCompileButton(false);

        // Show compilation progress - Phase 5.2.3
        if (typeof compilationProgress !== 'undefined') {
            compilationProgress.simulateProgress(1500);
        }

        console.log('Compiling code...');
        compilationData = await compileCode(sourceCode);

        console.log('✓ Compilation complete:', compilationData);

        // Switch to first stage and render
        currentStage = 1;
        setActiveTab(1);
        renderCurrentStage();

        showLoading(false);
        isCompiling = false;
        updateCompileButton(true);

    } catch (error) {
        console.error('Compilation failed:', error);
        showError(`Compilation failed: ${error.message}`);
        showLoading(false);
        isCompiling = false;
        updateCompileButton(true);
    }
}

// ============================================
// Stage Tab Click Handler
// ============================================
function handleStageTabClick(stageNum) {
    if (!compilationData) {
        showError('Please compile some code first');
        return;
    }

    currentStage = stageNum;
    setActiveTab(stageNum);
    renderCurrentStage();
}

// ============================================
// Render Current Stage
// ============================================
function renderCurrentStage() {
    if (!compilationData) {
        console.warn('No compilation data to render');
        return;
    }

    // Clear previous content
    clearOutput();

    // Check if compilation failed
    if (!compilationData.success) {
        renderErrors(compilationData);
        return;
    }

    // Render the selected stage
    renderStage(currentStage, compilationData);
}

// ============================================
// UI Helper Functions
// ============================================
function showLoading(show) {
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'flex' : 'none';
    }
}

function updateCompileButton(enabled) {
    if (compileButton) {
        compileButton.disabled = !enabled;
    }
}

function setActiveTab(stageNum) {
    stageTabs.forEach(tab => {
        const tabStageNum = parseInt(tab.dataset.stage);
        if (tabStageNum === stageNum) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

function clearOutput() {
    if (stageContent) {
        stageContent.innerHTML = '';
    }
}

function showError(message) {
    // Create error toast
    const errorToast = document.getElementById('error-toast');
    if (errorToast) {
        errorToast.textContent = message;
        errorToast.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorToast.style.display = 'none';
        }, 5000);
    }

    console.error(message);
}

// ============================================
// Auto-initialize when DOM is ready
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

console.log('Phase 3D: Core App Logic loaded ✓');
