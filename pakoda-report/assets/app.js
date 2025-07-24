class PakodaReportApp {
    constructor() {
        this.data = window.reportData || {};
        this.filteredTests = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.hideLoading();
        this.populateSummary();
        this.renderTests();
        this.setupEventListeners();
        this.animateProgressBar();
        this.animateSummaryCards();
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            setTimeout(() => {
                loading.style.opacity = '0';
                setTimeout(() => loading.remove(), 300);
            }, 1000);
        }
    }

    populateSummary() {
        const { summary, duration } = this.data;
        
        document.getElementById('total-tests').textContent = summary.total || 0;
        document.getElementById('passed-tests').textContent = summary.passed || 0;
        document.getElementById('failed-tests').textContent = summary.failed || 0;
        document.getElementById('skipped-tests').textContent = summary.skipped || 0;
        document.getElementById('pass-rate').textContent = `${summary.passRate || 0}%`;
        document.getElementById('duration').textContent = `Duration: ${this.formatDuration(duration || 0)}`;
    }

    formatDuration(ms) {
        if (ms < 1000) return `${ms}ms`;
        if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}m ${seconds}s`;
    }

    animateProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        const { summary } = this.data;
        const passRate = summary.passRate || 0;
        
        setTimeout(() => {
            progressBar.style.width = `${passRate}%`;
        }, 500);
    }

    animateSummaryCards() {
        const cards = document.querySelectorAll('.summary-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    renderTests() {
        const container = document.getElementById('test-results');
        const tests = this.data.tests || [];
        
        this.filteredTests = this.filterTests(tests);
        
        if (this.filteredTests.length === 0) {
            container.innerHTML = this.getEmptyState();
            return;
        }

        const html = this.filteredTests.map((test, index) => {
            return this.createTestItem(test, index);
        }).join('');

        container.innerHTML = html;
        this.setupTestItemListeners();
    }

    createTestItem(test, index) {
        const statusClass = `test-status-${test.status}`;
        const statusIcon = this.getStatusIcon(test.status);
        const hasError = test.error && test.status === 'failed';

        return `
            <div class="test-item" style="animation-delay: ${index * 0.05}s">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                            <span class="test-status-badge ${statusClass}">
                                <i class="${statusIcon}"></i>
                                <span>${test.status.toUpperCase()}</span>
                            </span>
                            <span class="duration-badge">${this.formatDuration(test.duration)}</span>
                            <span class="project-badge">${test.projectName}</span>
                        </div>
                        <h4 class="text-lg font-medium text-white mb-2">${this.escapeHtml(test.title)}</h4>
                        <div class="flex items-center space-x-3 text-sm text-gray-400">
                            <span class="location-badge">
                                <i class="fas fa-map-marker-alt mr-1"></i>
                                ${this.escapeHtml(test.location)}
                            </span>
                        </div>
                        ${hasError ? this.createErrorDetails(test.error) : ''}
                    </div>
                    <div class="flex items-center space-x-2 ml-4">
                        <button class="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700" 
                                onclick="app.copyTestInfo('${test.id}')" title="Copy test info">
                            <i class="fas fa-copy"></i>
                        </button>
                        ${hasError ? `
                            <button class="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-red-700" 
                                    onclick="app.toggleErrorDetails('${test.id}')" title="Toggle error details">
                                <i class="fas fa-bug"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    createErrorDetails(error) {
        return `
            <div class="error-details mt-4" id="error-${this.generateId()}">
                <div class="flex items-center space-x-2 mb-2">
                    <i class="fas fa-exclamation-triangle text-red-400"></i>
                    <span class="text-red-300 font-medium">Error Details</span>
                </div>
                <div class="error-message">${this.escapeHtml(error)}</div>
            </div>
        `;
    }

    getStatusIcon(status) {
        const icons = {
            passed: 'fas fa-check-circle',
            failed: 'fas fa-times-circle',
            skipped: 'fas fa-forward',
            timedOut: 'fas fa-clock'
        };
        return icons[status] || 'fas fa-question-circle';
    }

    getEmptyState() {
        return `
            <div class="p-12 text-center">
                <div class="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                    <i class="fas fa-search text-3xl text-gray-400"></i>
                </div>
                <h3 class="text-xl font-medium text-gray-300 mb-2">No tests found</h3>
                <p class="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
        `;
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.debounce(() => this.renderTests(), 300)();
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.renderTests();
            }
        });

        searchBtn.addEventListener('click', () => {
            this.renderTests();
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', this.toggleTheme.bind(this));

        // Export functionality
        const exportBtn = document.getElementById('export-btn');
        exportBtn.addEventListener('click', this.exportReport.bind(this));
    }

    setupTestItemListeners() {
        // Add any additional listeners for test items
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.renderTests();
    }

    filterTests(tests) {
        let filtered = tests;

        // Apply status filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(test => test.status === this.currentFilter);
        }

        // Apply search filter
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(test => 
                test.title.toLowerCase().includes(term) ||
                test.location.toLowerCase().includes(term) ||
                test.projectName.toLowerCase().includes(term)
            );
        }

        return filtered;
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.classList.remove(currentTheme);
        html.classList.add(newTheme);
        
        // Update icon
        const icon = document.querySelector('#theme-toggle i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun text-yellow-400' : 'fas fa-moon text-blue-400';
        
        // Save preference
        localStorage.setItem('pakoda-theme', newTheme);
    }

    exportReport() {
        const exportData = {
            summary: this.data.summary,
            tests: this.filteredTests,
            generatedAt: new Date().toISOString(),
            exportType: 'json'
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pakoda-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Report exported successfully!', 'success');
    }

    copyTestInfo(testId) {
        const test = this.data.tests.find(t => t.id === testId);
        if (!test) return;

        const info = `Test: ${test.title}
Status: ${test.status}
Duration: ${this.formatDuration(test.duration)}
Location: ${test.location}
Project: ${test.projectName}`;

        navigator.clipboard.writeText(info).then(() => {
            this.showNotification('Test info copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy test info', 'error');
        });
    }

    toggleErrorDetails(testId) {
        const errorElement = document.getElementById(`error-${testId}`);
        if (errorElement) {
            errorElement.style.display = errorElement.style.display === 'none' ? 'block' : 'none';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PakodaReportApp();
    
    // Apply saved theme
    const savedTheme = localStorage.getItem('pakoda-theme') || 'dark';
    document.documentElement.classList.add(savedTheme);
});