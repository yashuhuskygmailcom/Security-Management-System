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

// ============================================
// EXPORT FUNCTIONS
// ============================================

function exportTableToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) {
        showToast('Table not found', 'error');
        return;
    }
    
    let csv = [];
    
    // Get headers
    const headers = [];
    table.querySelectorAll('thead th').forEach(th => {
        if (!th.textContent.toLowerCase().includes('action')) {
            headers.push(th.textContent.trim());
        }
    });
    csv.push(headers.join(','));
    
    // Get rows (only visible ones)
    table.querySelectorAll('tbody tr').forEach(row => {
        if (row.style.display !== 'none' && !row.classList.contains('no-results')) {
            const cells = [];
            row.querySelectorAll('td').forEach((td, index) => {
                if (index < headers.length) {
                    let text = td.textContent.trim();
                    // Remove badges and formatting
                    text = text.replace(/[^\w\s\-()]/g, '');
                    cells.push(`"${text}"`);
                }
            });
            csv.push(cells.join(','));
        }
    });
    
    downloadFile(csv.join('\n'), filename + '.csv', 'text/csv');
    showToast(`Exported to ${filename}.csv`, 'success');
}

async function exportTableToPDF(tableId, filename) {
    try {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            showToast('PDF export not available', 'error');
            return;
        }
        
        const doc = new jsPDF();
        const table = document.getElementById(tableId);
        
        if (!table) {
            showToast('Table not found', 'error');
            return;
        }
        
        // Prepare table data
        const headers = [];
        table.querySelectorAll('thead th').forEach(th => {
            if (!th.textContent.toLowerCase().includes('action')) {
                headers.push(th.textContent.trim());
            }
        });
        
        const rows = [];
        table.querySelectorAll('tbody tr').forEach(row => {
            if (row.style.display !== 'none' && !row.classList.contains('no-results')) {
                const cells = [];
                row.querySelectorAll('td').forEach((td, index) => {
                    if (index < headers.length) {
                        cells.push(td.textContent.trim());
                    }
                });
                rows.push(cells);
            }
        });
        
        // Add title
        doc.setFontSize(16);
        doc.text(filename, 14, 10);
        doc.setFontSize(10);
        doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 20);
        
        // Add table if autoTable is available
        if (doc.autoTable) {
            doc.autoTable({
                head: [headers],
                body: rows,
                startY: 30,
                theme: 'grid',
                headStyles: {
                    fillColor: [102, 126, 234],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold'
                },
                bodyStyles: {
                    textColor: [50, 50, 50]
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                }
            });
        }
        
        doc.save(filename + '.pdf');
        showToast(`Exported to ${filename}.pdf`, 'success');
    } catch (error) {
        showToast('Error exporting to PDF: ' + error.message, 'error');
    }
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================
// ROLE-BASED ACCESS
// ============================================

function hasRole(requiredRole) {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const userRole = user.Role || '';
    
    if (typeof requiredRole === 'string') {
        return userRole === requiredRole;
    }
    
    return requiredRole.includes(userRole);
}

function canAccess(requiredRoles) {
    return hasRole(requiredRoles);
}

function hideIfNoRole(elementId, requiredRoles) {
    const element = document.getElementById(elementId);
    if (element && !canAccess(requiredRoles)) {
        element.style.display = 'none';
    }
}

function disableIfNoRole(elementId, requiredRoles) {
    const element = document.getElementById(elementId);
    if (element && !canAccess(requiredRoles)) {
        element.disabled = true;
        element.style.opacity = '0.5';
        element.title = 'You do not have permission for this action';
    }
}
