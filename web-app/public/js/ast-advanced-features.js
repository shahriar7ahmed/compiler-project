/**
 * AST Advanced Features - Phase 5.3.6
 * Search, export, and layout controls for AST visualization
 */

// Add search/filter UI to container - Phase 5.3.6
function addASTSearchControls(containerId, visualizer) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Create search bar container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'ast-search-container';
    searchContainer.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 10;
        background: #2d3748;
        padding: 8px 12px;
        border-radius: 8px;
        display: flex;
        gap: 8px;
        align-items: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    // Search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search nodes...';
    searchInput.style.cssText = `
        background: #1a202c;
        border: 1px solid #4a5568;
        color: #ffffff;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 13px;
        width: 180px;
        outline: none;
        transition: border-color 0.2s;
    `;
    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = '#6366f1';
    });
    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = '#4a5568';
    });
    searchInput.addEventListener('input', (e) => {
        if (visualizer && typeof visualizer.searchNodes === 'function') {
            visualizer.searchNodes(e.target.value);
        }
    });

    // Clear button
    const clearBtn = document.createElement('button');
    clearBtn.innerHTML = '✕';
    clearBtn.title = 'Clear search';
    clearBtn.style.cssText = `
        background: #4a5568;
        border: none;
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s;
    `;
    clearBtn.addEventListener('mouseover', () => {
        clearBtn.style.background = '#ef4444';
    });
    clearBtn.addEventListener('mouseout', () => {
        clearBtn.style.background = '#4a5568';
    });
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        if (visualizer && typeof visualizer.searchNodes === 'function') {
            visualizer.searchNodes('');
        }
    });

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(clearBtn);
    container.appendChild(searchContainer);
}

// Add export controls to container - Phase 5.3.6
function addASTExportControls(containerId, visualizer) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Create export controls container (bottom-right)
    const exportContainer = document.createElement('div');
    exportContainer.className = 'ast-export-container';
    exportContainer.style.cssText = `
        position: absolute;
        bottom: 10px;
        right: 10px;
        z-index: 10;
        display: flex;
        gap: 8px;
    `;

    // Export SVG button
    const svgBtn = document.createElement('button');
    svgBtn.innerHTML = '💾 SVG';
    svgBtn.title = 'Export as SVG';
    svgBtn.style.cssText = `
        background: #4a5568;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.2s;
    `;
    svgBtn.addEventListener('mouseover', () => {
        svgBtn.style.background = '#10b981';
    });
    svgBtn.addEventListener('mouseout', () => {
        svgBtn.style.background = '#4a5568';
    });
    svgBtn.addEventListener('click', () => {
        if (visualizer && typeof visualizer.exportSVG === 'function') {
            visualizer.exportSVG();
        }
    });

    // Export PNG button
    const pngBtn = document.createElement('button');
    pngBtn.innerHTML = '📸 PNG';
    pngBtn.title = 'Export as PNG';
    pngBtn.style.cssText = `
        background: #4a5568;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.2s;
    `;
    pngBtn.addEventListener('mouseover', () => {
        pngBtn.style.background = '#10b981';
    });
    pngBtn.addEventListener('mouseout', () => {
        pngBtn.style.background = '#4a5568';
    });
    pngBtn.addEventListener('click', () => {
        if (visualizer && typeof visualizer.exportPNG === 'function') {
            visualizer.exportPNG();
        }
    });

    exportContainer.appendChild(svgBtn);
    exportContainer.appendChild(pngBtn);
    container.appendChild(exportContainer);
}

// Add layout toggle controls - Phase 5.3.6
function addASTLayoutControls(containerId, visualizer) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Create layout controls container (bottom-left)
    const layoutContainer = document.createElement('div');
    layoutContainer.className = 'ast-layout-container';
    layoutContainer.style.cssText = `
        position: absolute;
        bottom: 10px;
        left: 10px;
        z-index: 10;
        background: #2d3748;
        padding: 8px;
        border-radius: 8px;
        display: flex;
        gap: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    const layouts = [
        { name: 'vertical', icon: '⬇️', title: 'Vertical Layout' },
        { name: 'horizontal', icon: '➡️', title: 'Horizontal Layout' },
        { name: 'radial', icon: '⭕', title: 'Radial Layout' }
    ];

    layouts.forEach(layout => {
        const btn = document.createElement('button');
        btn.innerHTML = layout.icon;
        btn.title = layout.title;
        btn.dataset.layout = layout.name;
        btn.style.cssText = `
            background: #4a5568;
            color: white;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.2s;
        `;

        if (layout.name === 'vertical') {
            btn.style.background = '#6366f1'; // Active state
        }

        btn.addEventListener('click', () => {
            // Update active state
            layoutContainer.querySelectorAll('button').forEach(b => {
                b.style.background = '#4a5568';
            });
            btn.style.background = '#6366f1';

            // Change layout
            if (visualizer && typeof visualizer.setLayout === 'function') {
                visualizer.setLayout(layout.name);
            }
        });

        btn.addEventListener('mouseover', () => {
            if (btn.style.background !== 'rgb(99, 102, 241)') {
                btn.style.background = '#5a6578';
            }
        });

        btn.addEventListener('mouseout', () => {
            if (btn.style.background !== 'rgb(99, 102, 241)') {
                btn.style.background = '#4a5568';
            }
        });

        layoutContainer.appendChild(btn);
    });

    container.appendChild(layoutContainer);
}

console.log('AST Advanced Features loaded (Phase 5.3.6) ✓');
