// DOM Elements
const extensionsGrid = document.querySelector('.extensions-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const themeToggle = document.querySelector('.theme-toggle');

// State
let extensions = [
    {
        "logo": "logo-devlens.svg",
        "name": "DevLens",
        "description": "Quickly inspect page layouts and visualize element boundaries.",
        "isActive": true
    },
    {
        "logo": "logo-style-spy.svg",
        "name": "StyleSpy",
        "description": "Instantly analyze and copy CSS from any webpage element.",
        "isActive": true
    },
    {
        "logo": "logo-speed-boost.svg",
        "name": "SpeedBoost",
        "description": "Optimizes browser resource usage to accelerate page loading.",
        "isActive": false
    },
    {
        "logo": "logo-json-wizard.svg",
        "name": "JSONWizard",
        "description": "Formats, validates, and prettifies JSON responses in-browser.",
        "isActive": true
    },
    {
        "logo": "logo-tab-master-pro.svg",
        "name": "TabMaster Pro",
        "description": "Organizes browser tabs into groups and sessions.",
        "isActive": true
    },
    {
        "logo": "logo-viewport-buddy.svg",
        "name": "ViewportBuddy",
        "description": "Simulates various screen resolutions directly within the browser.",
        "isActive": false
    },
    {
        "logo": "logo-markup-notes.svg",
        "name": "Markup Notes",
        "description": "Enables annotation and notes directly onto webpages for collaborative debugging.",
        "isActive": true
    },
    {
        "logo": "logo-grid-guides.svg",
        "name": "GridGuides",
        "description": "Overlay customizable grids and alignment guides on any webpage.",
        "isActive": false
    },
    {
        "logo": "logo-palette-picker.svg",
        "name": "Palette Picker",
        "description": "Instantly extracts color palettes from any webpage.",
        "isActive": true
    },
    {
        "logo": "logo-link-checker.svg",
        "name": "LinkChecker",
        "description": "Scans and highlights broken links on any page.",
        "isActive": true
    },
    {
        "logo": "logo-dom-snapshot.svg",
        "name": "DOM Snapshot",
        "description": "Capture and export DOM structures quickly.",
        "isActive": false
    },
    {
        "logo": "logo-console-plus.svg",
        "name": "ConsolePlus",
        "description": "Enhanced developer console with advanced filtering and logging.",
        "isActive": true
    }
];
let currentFilter = 'all';

// Theme Management
const theme = {
    get current() {
        return document.body.getAttribute('data-theme') || 'light';
    },
    set current(value) {
        document.body.setAttribute('data-theme', value);
        localStorage.setItem('theme', value);
        // Update aria-label based on current theme
        themeToggle.setAttribute('aria-label', 
            value === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
        );
    },
    initialize() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.current = savedTheme;
    }
};

// Initialize theme
theme.initialize();

// Event Listeners
themeToggle.addEventListener('click', () => {
    theme.current = theme.current === 'light' ? 'dark' : 'light';
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update filter buttons
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        
        // Update current filter and render
        currentFilter = button.dataset.filter;
        renderExtensions();
    });
});

// Extension Card Template
function createExtensionCard(extension) {
    const card = document.createElement('div');
    card.className = `extension-card ${extension.isActive ? 'active' : 'inactive'}`;
    card.setAttribute('role', 'article');
    
    card.innerHTML = `
        <img src="${extension.logo}" alt="${extension.name} logo" class="extension-logo" onerror="this.onerror=null; this.src='logo.svg';">
        <div class="extension-info">
            <h2>${extension.name}</h2>
            <p>${extension.description}</p>
            <div class="extension-controls">
                <button class="remove-btn" aria-label="Remove ${extension.name}">Remove</button>
                <div></div>
                <label class="toggle-switch" aria-label="Toggle ${extension.name} active state">
                    <input type="checkbox" ${extension.isActive ? 'checked' : ''} aria-checked="${extension.isActive}">
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
    `;

    // Add event listeners
    const toggleInput = card.querySelector('.toggle-switch input');
    const removeBtn = card.querySelector('.remove-btn');

    toggleInput.addEventListener('change', () => {
        extension.isActive = toggleInput.checked;
        toggleInput.setAttribute('aria-checked', extension.isActive);
        card.className = `extension-card ${extension.isActive ? 'active' : 'inactive'}`;
        
        // If we're filtering, we might need to re-render
        if (currentFilter !== 'all') {
            renderExtensions();
        }
    });

    removeBtn.addEventListener('click', () => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            extensions = extensions.filter(e => e.name !== extension.name);
            renderExtensions();
        }, 200);
    });

    return card;
}

// Render Extensions
function renderExtensions() {
    extensionsGrid.innerHTML = '';
    
    const filteredExtensions = extensions.filter(extension => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'active') return extension.isActive;
        if (currentFilter === 'inactive') return !extension.isActive;
    });

    if (filteredExtensions.length === 0) {
        const message = document.createElement('p');
        message.className = 'error';
        message.textContent = currentFilter === 'all' ? 
            'No extensions found.' : 
            `No ${currentFilter} extensions found.`;
        extensionsGrid.appendChild(message);
        return;
    }

    // Create a document fragment for better performance
    const fragment = document.createDocumentFragment();
    filteredExtensions.forEach(extension => {
        const card = createExtensionCard(extension);
        fragment.appendChild(card);
    });

    // Append all cards at once
    extensionsGrid.appendChild(fragment);

    // Trigger animations after a brief delay
    requestAnimationFrame(() => {
        extensionsGrid.querySelectorAll('.extension-card').forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50); // Stagger the animations
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderExtensions();
}); 