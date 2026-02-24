/* ============================================
   UTILITY FUNCTIONS - Toast, Loading, Search, Sort
   ============================================ */

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function initToastContainer() {
    if (!document.getElementById('toastContainer')) {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'info', duration = 3000) {
    initToastContainer();
    
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <div class="toast-content">${message}</div>
        <button class="toast-close">✕</button>
    `;
    
    container.appendChild(toast);
    
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        removeToast(toast);
    });
    
    if (duration > 0) {
        setTimeout(() => {
            removeToast(toast);
        }, duration);
    }
    
    return toast;
}

function removeToast(toast) {
    toast.classList.add('removing');
    setTimeout(() => {
        toast.remove();
    }, 300);
}

// ============================================
// LOADING OVERLAY
// ============================================

function showLoading() {
    let overlay = document.getElementById('spinnerOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'spinnerOverlay';
        overlay.className = 'spinner-overlay';
        overlay.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('spinnerOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// ============================================
// BUTTON LOADING STATE
// ============================================

function setButtonLoading(button, isLoading = true) {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('btn-loading');
        button.dataset.originalText = button.textContent;
        button.innerHTML = '<span class="spinner"></span>';
    } else {
        button.disabled = false;
        button.classList.remove('btn-loading');
        button.textContent = button.dataset.originalText || button.textContent;
    }
}

// ============================================
// SEARCH & FILTER
// ============================================

function filterTableBySearch(tableBodyId, searchValue, searchableColumns = []) {
    const tbody = document.getElementById(tableBodyId);
    const rows = tbody.querySelectorAll('tr');
    let visibleCount = 0;
    
    const searchLower = searchValue.toLowerCase().trim();
    
    rows.forEach(row => {
        let shouldShow = true;
        
        if (searchLower) {
            if (searchableColumns.length > 0) {
                // Search only in specified columns
                shouldShow = searchableColumns.some(colIndex => {
                    const cell = row.cells[colIndex];
                    return cell && cell.textContent.toLowerCase().includes(searchLower);
                });
            } else {
                // Search in all cells
                shouldShow = row.textContent.toLowerCase().includes(searchLower);
            }
        }
        
        row.style.display = shouldShow ? '' : 'none';
        if (shouldShow) visibleCount++;
    });
    
    // Show "no results" message if needed
    if (visibleCount === 0 && rows.length > 0) {
        const noResults = tbody.querySelector('.no-results');
        if (!noResults) {
            const row = tbody.insertRow();
            row.className = 'no-results';
            row.innerHTML = `<td colspan="100%"><div class="no-results-icon">🔍</div><div>No results found</div></td>`;
        }
    } else {
        const noResults = tbody.querySelector('.no-results');
        if (noResults) noResults.remove();
    }
    
    return visibleCount;
}

// ============================================
// SORTING
// ============================================

let sortConfig = {};

function setupSortableColumns(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const headers = table.querySelectorAll('thead th');
    
    headers.forEach((header, index) => {
        if (!header.classList.contains('sortable')) {
            header.classList.add('sortable');
            header.innerHTML += '<span class="sort-indicator"></span>';
        }
        
        header.addEventListener('click', () => {
            sortTable(tableId, index, header);
        });
    });
}

function sortTable(tableId, columnIndex, headerElement) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr')).filter(r => !r.classList.contains('no-results'));
    
    // Skip action column (last column is usually actions)
    if (columnIndex === table.querySelectorAll('thead th').length - 1) {
        return;
    }
    
    // Determine sort direction
    const isAsc = !headerElement.classList.contains('asc');
    
    // Remove active class from other headers
    table.querySelectorAll('thead th').forEach(h => {
        h.classList.remove('asc', 'desc');
    });
    
    // Add active class to current header
    headerElement.classList.add(isAsc ? 'asc' : 'desc');
    
    // Sort rows
    rows.sort((a, b) => {
        let aVal = a.cells[columnIndex].textContent.trim();
        let bVal = b.cells[columnIndex].textContent.trim();
        
        // Try to parse as numbers
        if (!isNaN(aVal) && !isNaN(bVal)) {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
        } else {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (aVal < bVal) return isAsc ? -1 : 1;
        if (aVal > bVal) return isAsc ? 1 : -1;
        return 0;
    });
    
    // Reorder rows in DOM
    rows.forEach(row => tbody.appendChild(row));
}

// ============================================
// PAGINATION
// ============================================

function paginateTable(tableBodyId, itemsPerPage = 10) {
    const tbody = document.getElementById(tableBodyId);
    const allRows = tbody.querySelectorAll('tr:not(.no-results)');
    const totalPages = Math.ceil(allRows.length / itemsPerPage);
    let currentPage = 1;
    
    function showPage(page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        allRows.forEach((row, index) => {
            row.style.display = (index >= startIndex && index < endIndex) ? '' : 'none';
        });
        
        currentPage = page;
        updatePaginationControls();
    }
    
    function updatePaginationControls() {
        let paginationDiv = document.getElementById('pagination-' + tableBodyId);
        if (!paginationDiv) {
            paginationDiv = document.createElement('div');
            paginationDiv.id = 'pagination-' + tableBodyId;
            paginationDiv.style.cssText = 'display:flex; gap:8px; justify-content:center; margin-top:20px; flex-wrap:wrap;';
            tbody.parentElement.parentElement.appendChild(paginationDiv);
        }
        
        paginationDiv.innerHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.style.cssText = `
                padding: 8px 12px;
                border: 1px solid #ddd;
                background: ${i === currentPage ? '#1a73e8' : 'white'};
                color: ${i === currentPage ? 'white' : 'black'};
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
            `;
            
            btn.addEventListener('click', () => showPage(i));
            paginationDiv.appendChild(btn);
        }
    }
    
    if (totalPages > 1) {
        showPage(1);
    }
}

// ============================================
// API WRAPPER WITH LOADING
// ============================================

async function fetchWithLoading(url, options = {}) {
    const showOverlay = options.showOverlay !== false;
    const showIndicator = options.showIndicator !== false;
    
    if (showOverlay) showLoading();
    
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }
        
        return data;
    } catch (error) {
        showToast(error.message || 'Request failed', 'error');
        throw error;
    } finally {
        if (showOverlay) hideLoading();
    }
}

// ============================================
// UTILITY HELPERS
// ============================================

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function debounce(func, delay = 300) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}
