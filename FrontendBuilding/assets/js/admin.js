/**
 * EstateBasic - Admin Dashboard Controller
 * Handles Navigation, RBAC, Overview KPIs, Building CRUD, Staff Assignments, Customer CRUD, Transactions & User Management
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in
    if (!Auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Render User Header Profile & Role Badge
    renderUserProfile();

    // Attach Sidebar Navigation click handlers
    initNavigation();

    // Attach Topbar Role Switcher listener
    initRoleSwitcher();

    // Render Initial View (Overview Dashboard)
    await renderOverview();
});

/**
 * Render Header User Info & RBAC checks
 */
function renderUserProfile() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const nameEl = document.getElementById('adminUserName');
    const badgeEl = document.getElementById('adminUserRoleBadge');
    const avatarEl = document.getElementById('adminUserAvatar');

    if (nameEl) nameEl.textContent = user.fullname;
    if (avatarEl) avatarEl.textContent = user.fullname.charAt(0).toUpperCase();

    if (badgeEl) {
        if (Auth.isManager()) {
            badgeEl.textContent = 'MANAGER';
            badgeEl.className = 'user-role-badge role-manager';
        } else {
            badgeEl.textContent = 'STAFF';
            badgeEl.className = 'user-role-badge role-staff';
        }
    }

    // Hide Manager-Only Menu Items if user is STAFF
    const managerOnlyNav = document.querySelectorAll('.manager-only');
    managerOnlyNav.forEach(el => {
        el.style.display = Auth.isManager() ? 'block' : 'none';
    });
}

/**
 * Sidebar Navigation & Tab Switching
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link-admin');
    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            if (!tabId) return;

            // Enforce RBAC for User Management
            if (tabId === 'tab-users' && !Auth.isManager()) {
                alert('Bạn không có quyền truy cập trang Quản lý Tài khoản! Quyền này dành riêng cho MANAGER.');
                return;
            }

            // Update active menu link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Update visible tab pane
            const panes = document.querySelectorAll('.admin-tab-pane');
            panes.forEach(p => p.classList.remove('active'));

            const targetPane = document.getElementById(tabId);
            if (targetPane) {
                targetPane.classList.add('active');
            }

            // Update Page Title
            const titleEl = document.getElementById('adminPageTitle');
            if (titleEl) {
                const titles = {
                    'tab-overview': 'Tổng Quan Hệ Thống',
                    'tab-buildings': 'Quản Lý Tòa Nhà Bất Động Sản',
                    'tab-customers': 'Quản Lý Khách Hàng',
                    'tab-transactions': 'Quản Lý Lịch Sử Giao Dịch',
                    'tab-users': 'Quản Lý Tài Khoản & Nhân Viên'
                };
                titleEl.textContent = titles[tabId] || 'Admin Dashboard';
            }

            // Trigger Tab Specific Loader
            switch (tabId) {
                case 'tab-overview': await renderOverview(); break;
                case 'tab-buildings': await renderBuildingsTab(); break;
                case 'tab-customers': await renderCustomersTab(); break;
                case 'tab-transactions': await renderTransactionsTab(); break;
                case 'tab-users': await renderUsersTab(); break;
            }
        });
    });
}

/**
 * Topbar Role Switcher dropdown for instant demoing
 */
function initRoleSwitcher() {
    const select = document.getElementById('quickRoleSwitcher');
    if (select) {
        const currentUser = Auth.getCurrentUser();
        select.value = currentUser ? currentUser.username : 'manager';
        select.addEventListener('change', (e) => {
            Auth.switchRole(e.target.value);
        });
    }
}

// ==========================================================================
// 1. OVERVIEW TAB
// ==========================================================================
async function renderOverview() {
    try {
        const buildings = await ApiService.getBuildings();
        const customers = await ApiService.getCustomers();
        const transactions = await ApiService.getTransactionsByCustomer();

        document.getElementById('statTotalBuildings').textContent = buildings.length;
        document.getElementById('statTotalCustomers').textContent = customers.length;
        document.getElementById('statTotalTransactions').textContent = transactions.length;

        // Render Recent Activity Table
        const recentTbody = document.getElementById('recentTransactionsTbody');
        if (recentTbody) {
            recentTbody.innerHTML = transactions.slice(0, 5).map(t => `
                <tr>
                    <td><span class="badge bg-primary">${t.typeName}</span></td>
                    <td class="fw-bold">${t.customerName}</td>
                    <td>${t.note}</td>
                    <td class="text-muted small">${t.createddate}</td>
                    <td><span class="badge bg-secondary">${t.createdby}</span></td>
                </tr>
            `).join('');
        }
    } catch (err) {
        console.error('Error rendering Overview:', err);
    }
}

// ==========================================================================
// 2. BUILDING MANAGEMENT TAB
// ==========================================================================
async function renderBuildingsTab() {
    const tbody = document.getElementById('buildingsTbody');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>`;

    try {
        const buildings = await ApiService.getBuildings();
        const users = await ApiService.getUsers();
        const staffList = users.filter(u => u.roles.includes('STAFF'));

        tbody.innerHTML = buildings.map(b => {
            const assignedStaffNames = staffList
                .filter(s => b.assignedStaffIds && b.assignedStaffIds.includes(s.id))
                .map(s => s.fullname)
                .join(', ');

            return `
                <tr>
                    <td class="fw-bold">${b.name}</td>
                    <td>${b.street}, ${b.ward}, ${b.districtName}</td>
                    <td>${b.structure || '-'}</td>
                    <td class="fw-bold text-primary">$${b.rentprice}/m²</td>
                    <td><span class="badge bg-light text-dark">${b.rentAreas ? b.rentAreas.join(', ') + ' m²' : '-'}</span></td>
                    <td>
                        <span class="badge bg-info text-dark" title="${assignedStaffNames || 'Chưa phân công'}">
                            <i class="fa-solid fa-user-gear me-1"></i> ${b.assignedStaffIds ? b.assignedStaffIds.length : 0} NV
                        </span>
                    </td>
                    <td class="text-end">
                        <button class="btn-action btn-action-primary me-1" onclick="openAssignBuildingModal(${b.id})" title="Phân công nhân viên">
                            <i class="fa-solid fa-user-plus"></i>
                        </button>
                        <button class="btn-action me-1" onclick="editBuilding(${b.id})" title="Chỉnh sửa">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        ${Auth.isManager() ? `
                            <button class="btn-action btn-action-danger" onclick="deleteBuilding(${b.id})" title="Xóa">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error('Error rendering Buildings Table:', err);
    }
}

/**
 * Open Modal to Add/Edit Building
 */
async function openBuildingModal(buildingId = null) {
    const districts = await ApiService.getDistricts();
    const rentTypes = await ApiService.getRentTypes();

    const form = document.getElementById('buildingForm');
    form.reset();

    // Populate District Select
    const districtSelect = document.getElementById('bDistrictId');
    districtSelect.innerHTML = `<option value="">-- Chọn Quận --</option>` +
        districts.map(d => `<option value="${d.id}">${d.name}</option>`).join('');

    // Populate Rent Type Checkboxes
    const rentTypesContainer = document.getElementById('bRentTypesContainer');
    rentTypesContainer.innerHTML = rentTypes.map(rt => `
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="bRentTypes" value="${rt.id}" id="rt_${rt.id}">
            <label class="form-check-label" for="rt_${rt.id}">${rt.name}</label>
        </div>
    `).join('');

    if (buildingId) {
        document.getElementById('buildingModalTitle').textContent = 'Chỉnh Sửa Tòa Nhà';
        document.getElementById('buildingFormId').value = buildingId;
        const b = await ApiService.getBuildingById(buildingId);

        document.getElementById('bName').value = b.name || '';
        document.getElementById('bStreet').value = b.street || '';
        document.getElementById('bWard').value = b.ward || '';
        document.getElementById('bDistrictId').value = b.districtid || '';
        document.getElementById('bStructure').value = b.structure || '';
        document.getElementById('bBasements').value = b.numberofbasement || 0;
        document.getElementById('bFloorArea').value = b.floorarea || 0;
        document.getElementById('bDirection').value = b.direction || '';
        document.getElementById('bLevel').value = b.level || '';
        document.getElementById('bRentPrice').value = b.rentprice || '';
        document.getElementById('bRentPriceDesc').value = b.rentpricedescription || '';
        document.getElementById('bServiceFee').value = b.servicefee || '';
        document.getElementById('bCarFee').value = b.carfee || '';
        document.getElementById('bMotorbikeFee').value = b.motorbikefee || '';
        document.getElementById('bOvertimeFee').value = b.overtimefee || '';
        document.getElementById('bWaterFee').value = b.waterfee || '';
        document.getElementById('bElectricityFee').value = b.electricityfee || '';
        document.getElementById('bDeposit').value = b.deposit || '';
        document.getElementById('bPayment').value = b.payment || '';
        document.getElementById('bRentTime').value = b.renttime || '';
        document.getElementById('bDecorationTime').value = b.decorationtime || '';
        document.getElementById('bBrokerageFee').value = b.brokeragefee || '';
        document.getElementById('bNote').value = b.note || '';
        document.getElementById('bManagerName').value = b.managername || '';
        document.getElementById('bManagerPhone').value = b.managerphonenumber || '';
        document.getElementById('bRentAreasInput').value = b.rentAreas ? b.rentAreas.join(', ') : '';

        // Check assigned rent types
        if (b.rentTypeIds) {
            b.rentTypeIds.forEach(rtId => {
                const cb = document.getElementById(`rt_${rtId}`);
                if (cb) cb.checked = true;
            });
        }
    } else {
        document.getElementById('buildingModalTitle').textContent = 'Thêm Tòa Nhà Mới';
        document.getElementById('buildingFormId').value = '';
    }

    const modalEl = document.getElementById('buildingModal');
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
}

/**
 * Handle Save Building (Create / Update)
 */
async function saveBuilding(e) {
    e.preventDefault();
    const id = document.getElementById('buildingFormId').value;
    
    const rentAreasStr = document.getElementById('bRentAreasInput').value;
    const rentAreas = rentAreasStr.split(',').map(s => s.trim()).filter(s => s !== '');

    const checkedRentTypes = Array.from(document.querySelectorAll('input[name="bRentTypes"]:checked')).map(cb => cb.value);

    const buildingData = {
        name: document.getElementById('bName').value,
        street: document.getElementById('bStreet').value,
        ward: document.getElementById('bWard').value,
        districtid: document.getElementById('bDistrictId').value,
        structure: document.getElementById('bStructure').value,
        numberofbasement: document.getElementById('bBasements').value,
        floorarea: document.getElementById('bFloorArea').value,
        direction: document.getElementById('bDirection').value,
        level: document.getElementById('bLevel').value,
        rentprice: document.getElementById('bRentPrice').value,
        rentpricedescription: document.getElementById('bRentPriceDesc').value,
        servicefee: document.getElementById('bServiceFee').value,
        carfee: document.getElementById('bCarFee').value,
        motorbikefee: document.getElementById('bMotorbikeFee').value,
        overtimefee: document.getElementById('bOvertimeFee').value,
        waterfee: document.getElementById('bWaterFee').value,
        electricityfee: document.getElementById('bElectricityFee').value,
        deposit: document.getElementById('bDeposit').value,
        payment: document.getElementById('bPayment').value,
        renttime: document.getElementById('bRentTime').value,
        decorationtime: document.getElementById('bDecorationTime').value,
        brokeragefee: document.getElementById('bBrokerageFee').value,
        note: document.getElementById('bNote').value,
        managername: document.getElementById('bManagerName').value,
        managerphonenumber: document.getElementById('bManagerPhone').value,
        rentAreas: rentAreas,
        rentTypeIds: checkedRentTypes
    };

    try {
        if (id) {
            await ApiService.updateBuilding(id, buildingData);
            alert('Cập nhật tòa nhà thành công!');
        } else {
            await ApiService.createBuilding(buildingData);
            alert('Thêm tòa nhà mới thành công!');
        }

        const modalEl = document.getElementById('buildingModal');
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();

        await renderBuildingsTab();
    } catch (err) {
        console.error('Error saving building:', err);
        alert('Lỗi lưu thông tin tòa nhà!');
    }
}

async function editBuilding(id) {
    await openBuildingModal(id);
}

async function deleteBuilding(id) {
    if (confirm('Bạn có chắc chắn muốn xóa tòa nhà này? Hành động này không thể hoàn tác.')) {
        try {
            await ApiService.deleteBuilding(id);
            alert('Đã xóa tòa nhà!');
            await renderBuildingsTab();
        } catch (err) {
            alert('Lỗi khi xóa tòa nhà!');
        }
    }
}

/**
 * Open Modal to Assign Staff to Building
 */
async function openAssignBuildingModal(buildingId) {
    const building = await ApiService.getBuildingById(buildingId);
    const users = await ApiService.getUsers();
    const staffUsers = users.filter(u => u.roles.includes('STAFF'));

    document.getElementById('assignBuildingId').value = buildingId;
    document.getElementById('assignBuildingName').textContent = building.name;

    const container = document.getElementById('staffBuildingCheckboxes');
    container.innerHTML = staffUsers.map(s => {
        const isAssigned = building.assignedStaffIds && building.assignedStaffIds.includes(s.id);
        return `
            <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" name="assignStaffBuilding" value="${s.id}" id="ab_staff_${s.id}" ${isAssigned ? 'checked' : ''}>
                <label class="form-check-label fw-semibold" for="ab_staff_${s.id}">
                    ${s.fullname} <span class="text-muted font-normal">(${s.phone || s.email})</span>
                </label>
            </div>
        `;
    }).join('');

    const modalEl = document.getElementById('assignBuildingModal');
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
}

async function saveAssignBuilding() {
    const buildingId = document.getElementById('assignBuildingId').value;
    const checkedStaffIds = Array.from(document.querySelectorAll('input[name="assignStaffBuilding"]:checked')).map(cb => cb.value);

    try {
        await ApiService.assignBuildingStaff(buildingId, checkedStaffIds);
        alert('Cập nhật phân công nhân viên quản lý tòa nhà thành công!');
        const modalEl = document.getElementById('assignBuildingModal');
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
        await renderBuildingsTab();
    } catch (err) {
        alert('Lỗi khi phân công nhân viên!');
    }
}

// ==========================================================================
// 3. CUSTOMER MANAGEMENT TAB
// ==========================================================================
async function renderCustomersTab() {
    const tbody = document.getElementById('customersTbody');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>`;

    try {
        const customers = await ApiService.getCustomers();

        tbody.innerHTML = customers.map(c => `
            <tr>
                <td class="fw-bold">${c.fullname}</td>
                <td><i class="fa-solid fa-phone me-1 text-primary"></i>${c.phone}</td>
                <td><i class="fa-solid fa-envelope me-1 text-muted"></i>${c.email || 'Chưa có'}</td>
                <td>
                    ${c.assignedStaffNames && c.assignedStaffNames.length > 0 
                        ? c.assignedStaffNames.map(n => `<span class="badge bg-primary me-1">${n}</span>`).join('') 
                        : '<span class="badge bg-secondary">Chưa phân công</span>'}
                </td>
                <td class="text-end">
                    <button class="btn-action btn-action-primary me-1" onclick="openAssignCustomerModal(${c.id})" title="Phân công Staff phụ trách">
                        <i class="fa-solid fa-user-plus"></i>
                    </button>
                    <button class="btn-action btn-action-success me-1" onclick="viewCustomerTransactions(${c.id})" title="Xem lịch sử giao dịch">
                        <i class="fa-solid fa-receipt"></i>
                    </button>
                    <button class="btn-action me-1" onclick="openCustomerModal(${c.id})" title="Chỉnh sửa">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    ${Auth.isManager() ? `
                        <button class="btn-action btn-action-danger" onclick="deleteCustomer(${c.id})" title="Xóa">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Error rendering Customers Table:', err);
    }
}

async function openCustomerModal(customerId = null) {
    const form = document.getElementById('customerForm');
    form.reset();

    if (customerId) {
        document.getElementById('customerModalTitle').textContent = 'Chỉnh Sửa Khách Hàng';
        document.getElementById('customerFormId').value = customerId;
        const customers = await ApiService.getCustomers();
        const c = customers.find(x => x.id == customerId);
        if (c) {
            document.getElementById('cFullname').value = c.fullname;
            document.getElementById('cPhone').value = c.phone;
            document.getElementById('cEmail').value = c.email || '';
        }
    } else {
        document.getElementById('customerModalTitle').textContent = 'Thêm Khách Hàng Mới';
        document.getElementById('customerFormId').value = '';
    }

    const modalEl = document.getElementById('customerModal');
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
}

async function saveCustomer(e) {
    e.preventDefault();
    const id = document.getElementById('customerFormId').value;
    const customerData = {
        fullname: document.getElementById('cFullname').value,
        phone: document.getElementById('cPhone').value,
        email: document.getElementById('cEmail').value
    };

    try {
        if (id) {
            await ApiService.updateCustomer(id, customerData);
            alert('Cập nhật khách hàng thành công!');
        } else {
            await ApiService.createCustomer(customerData);
            alert('Thêm khách hàng thành công!');
        }

        const modalEl = document.getElementById('customerModal');
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();

        await renderCustomersTab();
    } catch (err) {
        alert('Lỗi lưu thông tin khách hàng!');
    }
}

async function deleteCustomer(id) {
    if (confirm('Bạn có chắc muốn xóa khách hàng này?')) {
        try {
            await ApiService.deleteCustomer(id);
            await renderCustomersTab();
        } catch (err) {
            alert('Lỗi xóa khách hàng!');
        }
    }
}

async function openAssignCustomerModal(customerId) {
    const customers = await ApiService.getCustomers();
    const customer = customers.find(c => c.id == customerId);
    const users = await ApiService.getUsers();
    const staffUsers = users.filter(u => u.roles.includes('STAFF'));

    document.getElementById('assignCustomerId').value = customerId;
    document.getElementById('assignCustomerName').textContent = customer.fullname;

    const container = document.getElementById('staffCustomerCheckboxes');
    container.innerHTML = staffUsers.map(s => {
        const isAssigned = customer.assignedStaffIds && customer.assignedStaffIds.includes(s.id);
        return `
            <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" name="assignStaffCustomer" value="${s.id}" id="ac_staff_${s.id}" ${isAssigned ? 'checked' : ''}>
                <label class="form-check-label fw-semibold" for="ac_staff_${s.id}">
                    ${s.fullname} <span class="text-muted font-normal">(${s.phone})</span>
                </label>
            </div>
        `;
    }).join('');

    const modalEl = document.getElementById('assignCustomerModal');
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
}

async function saveAssignCustomer() {
    const customerId = document.getElementById('assignCustomerId').value;
    const checkedStaffIds = Array.from(document.querySelectorAll('input[name="assignStaffCustomer"]:checked')).map(cb => cb.value);

    try {
        await ApiService.assignCustomerStaff(customerId, checkedStaffIds);
        alert('Cập nhật phân công nhân viên chăm sóc khách hàng thành công!');
        const modalEl = document.getElementById('assignCustomerModal');
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
        await renderCustomersTab();
    } catch (err) {
        alert('Lỗi phân công nhân viên!');
    }
}

// ==========================================================================
// 4. TRANSACTION HISTORY TAB
// ==========================================================================
async function renderTransactionsTab(selectedCustomerId = null) {
    const customerSelect = document.getElementById('txCustomerSelect');
    const customers = await ApiService.getCustomers();

    if (customerSelect) {
        customerSelect.innerHTML = `<option value="">-- Tất cả Khách Hàng --</option>` +
            customers.map(c => `<option value="${c.id}" ${selectedCustomerId == c.id ? 'selected' : ''}>${c.fullname} - ${c.phone}</option>`).join('');

        customerSelect.onchange = async () => {
            await loadTransactionsList(customerSelect.value);
        };
    }

    await loadTransactionsList(selectedCustomerId || (customerSelect ? customerSelect.value : null));
}

async function loadTransactionsList(customerId) {
    const container = document.getElementById('transactionsTimeline');
    if (!container) return;

    try {
        const list = await ApiService.getTransactionsByCustomer(customerId);

        if (list.length === 0) {
            container.innerHTML = `<div class="alert alert-info text-center">Chưa có giao dịch nào cho lựa chọn này.</div>`;
            return;
        }

        container.innerHTML = list.map(t => `
            <div class="card mb-3 border-0 shadow-sm border-start border-4 border-primary">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-primary fs-6">${t.typeName}</span>
                        <small class="text-muted"><i class="fa-regular fa-clock me-1"></i>${t.createddate}</small>
                    </div>
                    <h6 class="fw-bold text-dark mb-1"><i class="fa-solid fa-user me-2 text-primary"></i>${t.customerName}</h6>
                    <p class="card-text text-secondary mb-2">${t.note}</p>
                    <div class="text-muted small">Người thực hiện: <strong>${t.createdby}</strong></div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Error loading transactions:', err);
    }
}

function viewCustomerTransactions(customerId) {
    // Switch to Transactions Tab
    const txLink = document.querySelector('[data-tab="tab-transactions"]');
    if (txLink) {
        txLink.click();
        setTimeout(() => {
            renderTransactionsTab(customerId);
        }, 150);
    }
}

async function openAddTransactionModal() {
    const customers = await ApiService.getCustomers();
    const types = await ApiService.getTransactionTypes();

    const customerSelect = document.getElementById('txFormCustomerId');
    customerSelect.innerHTML = `<option value="">-- Chọn Khách Hàng --</option>` +
        customers.map(c => `<option value="${c.id}">${c.fullname} - ${c.phone}</option>`).join('');

    const typeSelect = document.getElementById('txFormType');
    typeSelect.innerHTML = types.map(t => `<option value="${t.code}">${t.name}</option>`).join('');

    document.getElementById('txFormNote').value = '';

    const modalEl = document.getElementById('transactionModal');
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
}

async function saveTransaction(e) {
    e.preventDefault();
    const customerid = document.getElementById('txFormCustomerId').value;
    const type = document.getElementById('txFormType').value;
    const note = document.getElementById('txFormNote').value;

    try {
        await ApiService.createTransaction({ customerid, type, note });
        alert('Tạo giao dịch mới thành công!');

        const modalEl = document.getElementById('transactionModal');
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();

        await renderTransactionsTab(customerid);
    } catch (err) {
        alert('Lỗi tạo giao dịch!');
    }
}

// ==========================================================================
// 5. USER / STAFF MANAGEMENT TAB (MANAGER ONLY)
// ==========================================================================
async function renderUsersTab() {
    if (!Auth.isManager()) return;

    const tbody = document.getElementById('usersTbody');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>`;

    try {
        const users = await ApiService.getUsers();

        tbody.innerHTML = users.map(u => `
            <tr>
                <td class="fw-bold">${u.username}</td>
                <td>${u.fullname}</td>
                <td>${u.phone || '-'}</td>
                <td>
                    ${u.roles.map(r => `<span class="badge ${r === 'MANAGER' ? 'bg-warning text-dark' : 'bg-primary'} me-1">${r}</span>`).join('')}
                </td>
                <td>
                    <span class="badge-status ${u.status === 1 ? 'badge-active' : 'badge-inactive'}">
                        ${u.status === 1 ? 'Hoạt động' : 'Tạm khóa'}
                    </span>
                </td>
                <td class="text-end">
                    <button class="btn-action me-1" onclick="openUserModal(${u.id})" title="Sửa thông tin/Role">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-action ${u.status === 1 ? 'btn-action-danger' : 'btn-action-success'}" onclick="toggleUserStatus(${u.id})" title="${u.status === 1 ? 'Khóa tài khoản' : 'Kích hoạt'}">
                        <i class="fa-solid ${u.status === 1 ? 'fa-lock' : 'fa-lock-open'}"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Error rendering Users Tab:', err);
    }
}

async function openUserModal(userId = null) {
    const form = document.getElementById('userForm');
    form.reset();

    if (userId) {
        document.getElementById('userModalTitle').textContent = 'Chỉnh Sửa Tài Khoản';
        document.getElementById('userFormId').value = userId;
        const users = await ApiService.getUsers();
        const u = users.find(x => x.id == userId);
        if (u) {
            document.getElementById('uUsername').value = u.username;
            document.getElementById('uUsername').disabled = true; // Username locked on edit
            document.getElementById('uFullname').value = u.fullname;
            document.getElementById('uPhone').value = u.phone || '';
            document.getElementById('uEmail').value = u.email || '';
            document.getElementById('uPassword').value = '';

            document.getElementById('uRoleManager').checked = u.roles.includes('MANAGER');
            document.getElementById('uRoleStaff').checked = u.roles.includes('STAFF');
        }
    } else {
        document.getElementById('userModalTitle').textContent = 'Tạo Tài Khoản Mới';
        document.getElementById('userFormId').value = '';
        document.getElementById('uUsername').disabled = false;
        document.getElementById('uRoleStaff').checked = true;
    }

    const modalEl = document.getElementById('userModal');
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
}

async function saveUser(e) {
    e.preventDefault();
    const id = document.getElementById('userFormId').value;

    const roleCodes = [];
    if (document.getElementById('uRoleManager').checked) roleCodes.push('MANAGER');
    if (document.getElementById('uRoleStaff').checked) roleCodes.push('STAFF');

    const userData = {
        username: document.getElementById('uUsername').value,
        fullname: document.getElementById('uFullname').value,
        phone: document.getElementById('uPhone').value,
        email: document.getElementById('uEmail').value,
        password: document.getElementById('uPassword').value,
        roleCodes
    };

    try {
        if (id) {
            await ApiService.updateUser(id, userData);
            alert('Cập nhật tài khoản thành công!');
        } else {
            await ApiService.createUser(userData);
            alert('Tạo tài khoản mới thành công!');
        }

        const modalEl = document.getElementById('userModal');
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();

        await renderUsersTab();
    } catch (err) {
        alert('Lỗi lưu tài khoản!');
    }
}

async function toggleUserStatus(id) {
    try {
        await ApiService.toggleUserStatus(id);
        await renderUsersTab();
    } catch (err) {
        alert('Lỗi thay đổi trạng thái tài khoản!');
    }
}

// Attach global window bindings for onclick inline HTML calls
window.openBuildingModal = openBuildingModal;
window.saveBuilding = saveBuilding;
window.editBuilding = editBuilding;
window.deleteBuilding = deleteBuilding;
window.openAssignBuildingModal = openAssignBuildingModal;
window.saveAssignBuilding = saveAssignBuilding;

window.openCustomerModal = openCustomerModal;
window.saveCustomer = saveCustomer;
window.deleteCustomer = deleteCustomer;
window.openAssignCustomerModal = openAssignCustomerModal;
window.saveAssignCustomer = saveAssignCustomer;

window.viewCustomerTransactions = viewCustomerTransactions;
window.openAddTransactionModal = openAddTransactionModal;
window.saveTransaction = saveTransaction;

window.openUserModal = openUserModal;
window.saveUser = saveUser;
window.toggleUserStatus = toggleUserStatus;
