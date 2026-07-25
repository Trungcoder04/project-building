/**
 * EstateBasic - Public Portal Interactive Logic
 * Controls Homepage Search Filters, Building Cards Grid, Detail Modal, & Consultation Requests
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Filters & Data
    await initPublicPage();

    // 2. Event Listener: Search Form Submit
    const filterForm = document.getElementById('buildingFilterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await loadBuildings();
        });
    }

    // 3. Event Listener: Filter Reset Button
    const btnReset = document.getElementById('btnResetFilter');
    if (btnReset) {
        btnReset.addEventListener('click', async () => {
            filterForm.reset();
            // Uncheck all custom rent type checkboxes
            document.querySelectorAll('input[name="rentType"]').forEach(cb => cb.checked = false);
            await loadBuildings();
        });
    }

    // 4. Event Listener: Consultation Form Submission inside Detail Modal
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', handleConsultationSubmit);
    }
});

/**
 * Load Initial Options (Districts, Rent Types) and Initial Building List
 */
async function initPublicPage() {
    try {
        // Fetch Districts for Dropdown
        const districts = await ApiService.getDistricts();
        const districtSelect = document.getElementById('filterDistrict');
        if (districtSelect) {
            districtSelect.innerHTML = `<option value="">-- Tất cả các Quận --</option>` +
                districts.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
        }

        // Fetch Rent Types for Checkboxes Grid
        const rentTypes = await ApiService.getRentTypes();
        const rentTypesContainer = document.getElementById('filterRentTypesContainer');
        if (rentTypesContainer) {
            rentTypesContainer.innerHTML = rentTypes.map(rt => `
                <label class="custom-checkbox-btn">
                    <input type="checkbox" name="rentType" value="${rt.code}">
                    <span>${rt.name}</span>
                </label>
            `).join('');
        }

        // Load All Buildings
        await loadBuildings();

    } catch (err) {
        console.error('Error initializing Public Page:', err);
    }
}

/**
 * Fetch and Render Buildings Grid based on Form Filter values
 */
async function loadBuildings() {
    const grid = document.getElementById('buildingsGrid');
    const countBadge = document.getElementById('resultCount');

    if (!grid) return;

    grid.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Đang tải danh sách tòa nhà...</p>
        </div>
    `;

    // Extract Filter Values
    const name = document.getElementById('filterName')?.value || '';
    const districtId = document.getElementById('filterDistrict')?.value || '';
    const rentPriceFrom = document.getElementById('filterPriceFrom')?.value || '';
    const rentPriceTo = document.getElementById('filterPriceTo')?.value || '';
    const rentAreaFrom = document.getElementById('filterAreaFrom')?.value || '';
    const rentAreaTo = document.getElementById('filterAreaTo')?.value || '';
    
    // Rent Types multi-select
    const checkedTypes = Array.from(document.querySelectorAll('input[name="rentType"]:checked')).map(cb => cb.value);

    const filters = {
        name,
        districtId,
        rentPriceFrom,
        rentPriceTo,
        rentAreaFrom,
        rentAreaTo,
        typeCodes: checkedTypes
    };

    try {
        const buildings = await ApiService.getBuildings(filters);

        if (countBadge) {
            countBadge.textContent = `${buildings.length} Tòa nhà phù hợp`;
        }

        if (buildings.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fa-solid fa-building-circle-xmark display-3 text-muted mb-3"></i>
                    <h4 class="fw-bold">Không tìm thấy tòa nhà nào</h4>
                    <p class="text-muted">Vui lòng thử điều chỉnh lại bộ lọc tìm kiếm của bạn.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = buildings.map(b => createBuildingCardHtml(b)).join('');

    } catch (err) {
        console.error('Error loading buildings:', err);
        grid.innerHTML = `<div class="col-12 alert alert-danger">Lỗi khi tải dữ liệu tòa nhà!</div>`;
    }
}

/**
 * Generate HTML for single Building Card
 */
function createBuildingCardHtml(b) {
    const rentAreaBadges = b.rentAreas && b.rentAreas.length > 0 
        ? b.rentAreas.map(a => `<span class="area-badge">${a} m²</span>`).join('')
        : `<span class="area-badge">Liên hệ</span>`;

    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="building-card">
                <div class="building-img-wrap">
                    <img src="${b.image}" alt="${b.name}" loading="lazy">
                    <span class="building-badge-level">${b.level || 'Hạng A'}</span>
                    <span class="building-price-tag">$${b.rentprice} / m²</span>
                </div>
                <div class="building-card-body">
                    <h3 class="building-name">${b.name}</h3>
                    <div class="building-location">
                        <i class="fa-solid fa-location-dot text-primary mt-1"></i>
                        <span>${b.street}, ${b.ward}, ${b.districtName || 'TP.HCM'}</span>
                    </div>

                    <div class="building-specs-row">
                        <div class="spec-item">
                            <i class="fa-solid fa-layer-group"></i>
                            <span>${b.structure || 'Nhiều tầng'}</span>
                        </div>
                        <div class="spec-item">
                            <i class="fa-solid fa-compass"></i>
                            <span>${b.direction || 'Đông Nam'}</span>
                        </div>
                    </div>

                    <div class="area-tags-wrap">
                        <div class="w-100 text-muted small mb-1"><i class="fa-solid fa-ruler-combined me-1"></i>Diện tích trống:</div>
                        ${rentAreaBadges}
                    </div>

                    <div class="building-card-footer">
                        <button class="btn btn-sm btn-outline-primary fw-semibold rounded-pill px-3" onclick="openBuildingDetail(${b.id})">
                            <i class="fa-solid fa-eye me-1"></i> Chi tiết
                        </button>
                        <button class="btn btn-sm btn-primary-custom rounded-pill px-3" onclick="openConsultationModal(${b.id}, '${b.name.replace(/'/g, "\\'")}')">
                            <i class="fa-solid fa-paper-plane me-1"></i> Báo giá
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Open Building Detail Modal with Full Specifications Table
 */
async function openBuildingDetail(buildingId) {
    try {
        const b = await ApiService.getBuildingById(buildingId);
        if (!b) return;

        const modalTitle = document.getElementById('detailModalTitle');
        const modalBody = document.getElementById('detailModalBody');
        const consultationBuildingId = document.getElementById('modalBuildingId');

        if (consultationBuildingId) consultationBuildingId.value = b.id;
        if (modalTitle) modalTitle.textContent = b.name;

        const rentAreasStr = b.rentAreas ? b.rentAreas.join(' m², ') + ' m²' : 'Đang cập nhật';
        const rentTypesStr = b.rentTypeNames ? b.rentTypeNames.join(', ') : 'Đang cập nhật';

        if (modalBody) {
            modalBody.innerHTML = `
                <div class="detail-header-banner mb-4 rounded-3" style="background-image: url('${b.image}');">
                    <div class="detail-banner-content">
                        <span class="badge bg-primary fs-6 mb-2">${b.level || 'Hạng A'}</span>
                        <h2 class="text-white fw-bold mb-1">${b.name}</h2>
                        <p class="text-white-50 mb-0"><i class="fa-solid fa-location-dot me-2"></i>${b.street}, ${b.ward}, ${b.districtName}</p>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-7">
                        <h5 class="fw-bold mb-3 text-primary"><i class="fa-solid fa-list-check me-2"></i>Thông Tin Kết Cấu & Chi Phí</h5>
                        <table class="detail-table">
                            <tbody>
                                <tr><th>Địa chỉ</th><td>${b.street}, ${b.ward}, ${b.districtName}</td></tr>
                                <tr><th>Kết cấu tòa nhà</th><td>${b.structure || 'Chưa cập nhật'}</td></tr>
                                <tr><th>Số tầng hầm</th><td>${b.numberofbasement || 0} tầng hầm</td></tr>
                                <tr><th>Diện tích sàn</th><td>${b.floorarea || 0} m²</td></tr>
                                <tr><th>Hướng tòa nhà</th><td>${b.direction || 'Đang cập nhật'}</td></tr>
                                <tr><th>Giá thuê</th><td class="fw-bold text-primary fs-6">$${b.rentprice} / m² (${b.rentpricedescription || ''})</td></tr>
                                <tr><th>Diện tích trống</th><td><span class="badge bg-info text-dark">${rentAreasStr}</span></td></tr>
                                <tr><th>Loại hình thuê</th><td>${rentTypesStr}</td></tr>
                                <tr><th>Phí dịch vụ</th><td>${b.servicefee || 'Đã bao gồm'}</td></tr>
                                <tr><th>Phí ô tô / xe máy</th><td>${b.carfee || 'Theo quy định'} / ${b.motorbikefee || 'Theo quy định'}</td></tr>
                                <tr><th>Phí ngoài giờ</th><td>${b.overtimefee || 'Thỏa thuận'}</td></tr>
                                <tr><th>Tiền điện / nước</th><td>${b.electricityfee || 'Theo công tơ'} / ${b.waterfee || 'Theo quy định'}</td></tr>
                                <tr><th>Đặt cọc & Thanh toán</th><td>Đặt cọc ${b.deposit || '3 tháng'} | ${b.payment || 'Thanh toán theo quý'}</td></tr>
                                <tr><th>Thời hạn thuê</th><td>${b.renttime || 'Tối thiểu 2-3 năm'}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="col-md-5">
                        <div class="card border-0 bg-light p-4 rounded-3 h-100">
                            <h5 class="fw-bold text-secondary mb-3"><i class="fa-solid fa-user-tie me-2 text-primary"></i>Quản Lý Tòa Nhà</h5>
                            <div class="p-3 bg-white rounded-3 shadow-sm mb-4">
                                <div class="fw-bold fs-6 text-dark">${b.managername || 'BQL Tòa Nhà'}</div>
                                <div class="text-primary fw-bold fs-5 mt-1"><i class="fa-solid fa-phone me-2"></i>${b.managerphonenumber || '0901234567'}</div>
                            </div>

                            <h5 class="fw-bold text-secondary mb-3"><i class="fa-solid fa-paper-plane me-2 text-primary"></i>Đăng Ký Nhận Báo Giá</h5>
                            <form id="detailConsultationForm">
                                <input type="hidden" name="buildingId" value="${b.id}">
                                <div class="mb-2">
                                    <input type="text" class="form-control form-control-custom" name="fullname" placeholder="Họ và tên của bạn *" required>
                                </div>
                                <div class="mb-2">
                                    <input type="tel" class="form-control form-control-custom" name="phone" placeholder="Số điện thoại liên hệ *" required>
                                </div>
                                <div class="mb-3">
                                    <input type="email" class="form-control form-control-custom" name="email" placeholder="Địa chỉ Email">
                                </div>
                                <button type="submit" class="btn btn-primary-custom w-100">
                                    <i class="fa-solid fa-paper-plane me-1"></i> Gửi Yêu CầuNgay
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            // Attach submit listener for form inside detail modal
            document.getElementById('detailConsultationForm')?.addEventListener('submit', handleConsultationSubmit);
        }

        const modalEl = document.getElementById('buildingDetailModal');
        if (modalEl) {
            const bsModal = new bootstrap.Modal(modalEl);
            bsModal.show();
        }

    } catch (err) {
        console.error('Error opening building detail:', err);
    }
}

/**
 * Shortcut to open fast consultation modal
 */
function openConsultationModal(buildingId, buildingName) {
    const modalEl = document.getElementById('buildingDetailModal');
    if (modalEl) {
        openBuildingDetail(buildingId);
    }
}

/**
 * Handle new Customer viewing / consultation request (creates Customer + Transaction record)
 */
async function handleConsultationSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const fullname = formData.get('fullname');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const buildingId = formData.get('buildingId');

    try {
        // 1. Create New Customer Record (Spring Boot API: POST /api/customers)
        const customer = await ApiService.createCustomer({
            fullname,
            phone,
            email
        });

        // 2. Create Initial Consultation Transaction (Spring Boot API: POST /api/transactions)
        await ApiService.createTransaction({
            customerid: customer.id,
            type: 'TU_VAN',
            note: `Khách hàng đăng ký nhận báo giá & tư vấn qua Website cho Tòa nhà ID #${buildingId}`
        });

        alert(`Cảm ơn bạn ${fullname}! Yêu cầu tư vấn của bạn đã được gửi thành công. Chuyên viên của chúng tôi sẽ liên hệ lại trong ít phút.`);
        form.reset();

        // Close Modal
        const modalEl = document.getElementById('buildingDetailModal');
        if (modalEl) {
            const bsModal = bootstrap.Modal.getInstance(modalEl);
            if (bsModal) bsModal.hide();
        }

    } catch (err) {
        console.error('Error submitting consultation:', err);
        alert('Gửi yêu cầu thất bại! Vui lòng kiểm tra lại thông tin.');
    }
}

window.openBuildingDetail = openBuildingDetail;
window.openConsultationModal = openConsultationModal;
