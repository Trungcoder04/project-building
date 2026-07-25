/**
 * EstateBasic - REST API Service Layer
 * Bridge between Frontend UI and Java Spring Boot REST API Controllers.
 * Configured via CONFIG.MODE in config.js ('MOCK' vs 'API').
 */

const ApiService = {
    // Helper method for standard HTTP fetch
    async httpRequest(endpoint, options = {}) {
        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers
        };

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                ...options,
                headers
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    },

    // ==========================================
    // 1. DISTRICT API
    // Spring Boot Endpoint: GET /api/districts
    // ==========================================
    async getDistricts() {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            return db.districts;
        }
        return this.httpRequest('/districts');
    },

    // ==========================================
    // 2. RENT TYPE API
    // Spring Boot Endpoint: GET /api/renttypes
    // ==========================================
    async getRentTypes() {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            return db.rentTypes;
        }
        return this.httpRequest('/renttypes');
    },

    // ==========================================
    // 3. BUILDING API
    // Spring Boot Endpoints:
    // GET  /api/buildings?name=...&districtId=...&rentAreaFrom=...&rentAreaTo=...&rentPriceFrom=...&rentPriceTo=...&typeCodes=...
    // GET  /api/buildings/{id}
    // POST /api/buildings
    // PUT  /api/buildings/{id}
    // DELETE /api/buildings/{id}
    // ==========================================
    async getBuildings(filters = {}) {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            let result = [...db.buildings];

            if (filters.name) {
                const searchStr = filters.name.toLowerCase().trim();
                result = result.filter(b => b.name.toLowerCase().includes(searchStr) || b.street.toLowerCase().includes(searchStr));
            }

            if (filters.districtId) {
                result = result.filter(b => b.districtid == filters.districtId);
            }

            if (filters.rentPriceFrom) {
                result = result.filter(b => b.rentprice >= parseFloat(filters.rentPriceFrom));
            }

            if (filters.rentPriceTo) {
                result = result.filter(b => b.rentprice <= parseFloat(filters.rentPriceTo));
            }

            if (filters.rentAreaFrom || filters.rentAreaTo) {
                const from = filters.rentAreaFrom ? parseFloat(filters.rentAreaFrom) : 0;
                const to = filters.rentAreaTo ? parseFloat(filters.rentAreaTo) : Infinity;
                result = result.filter(b => {
                    const areas = db.rentAreas.filter(ra => ra.buildingid == b.id).map(ra => ra.value);
                    return areas.some(val => val >= from && val <= to);
                });
            }

            if (filters.typeCodes && filters.typeCodes.length > 0) {
                result = result.filter(b => {
                    const bRentTypes = db.buildingRentTypes.filter(brt => brt.buildingid == b.id).map(brt => brt.renttypeid);
                    const matchingRentTypeIds = db.rentTypes.filter(rt => filters.typeCodes.includes(rt.code)).map(rt => rt.id);
                    return bRentTypes.some(rtId => matchingRentTypeIds.includes(rtId));
                });
            }

            // Attach extra info (RentAreas, District Name, RentType Names)
            return result.map(b => {
                const district = db.districts.find(d => d.id == b.districtid);
                const bRentTypeIds = db.buildingRentTypes.filter(brt => brt.buildingid == b.id).map(brt => brt.renttypeid);
                const rentTypeNames = db.rentTypes.filter(rt => bRentTypeIds.includes(rt.id)).map(rt => rt.name);
                const rentAreas = db.rentAreas.filter(ra => ra.buildingid == b.id).map(ra => ra.value);
                const assignedStaffIds = db.assignmentBuildings.filter(ab => ab.buildingid == b.id).map(ab => ab.staffid);

                return {
                    ...b,
                    districtName: district ? district.name : '',
                    rentTypeNames,
                    rentTypeIds: bRentTypeIds,
                    rentAreas,
                    assignedStaffIds
                };
            });
        }

        // Real API call
        const queryParams = new URLSearchParams(filters).toString();
        return this.httpRequest(`/buildings?${queryParams}`);
    },

    async getBuildingById(id) {
        if (CONFIG.MODE === 'MOCK') {
            const buildings = await this.getBuildings();
            return buildings.find(b => b.id == id);
        }
        return this.httpRequest(`/buildings/${id}`);
    },

    async createBuilding(buildingData) {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            const newId = db.buildings.length > 0 ? Math.max(...db.buildings.map(b => b.id)) + 1 : 1;
            
            const newBuilding = {
                id: newId,
                name: buildingData.name,
                street: buildingData.street || '',
                ward: buildingData.ward || '',
                districtid: parseInt(buildingData.districtid),
                structure: buildingData.structure || '',
                numberofbasement: parseInt(buildingData.numberofbasement) || 0,
                floorarea: parseFloat(buildingData.floorarea) || 0,
                direction: buildingData.direction || '',
                level: buildingData.level || '',
                rentprice: parseFloat(buildingData.rentprice) || 0,
                rentpricedescription: buildingData.rentpricedescription || `${buildingData.rentprice} USD/m2`,
                servicefee: buildingData.servicefee || '',
                carfee: buildingData.carfee || '',
                motorbikefee: buildingData.motorbikefee || '',
                overtimefee: buildingData.overtimefee || '',
                waterfee: buildingData.waterfee || '',
                electricityfee: buildingData.electricityfee || '',
                deposit: buildingData.deposit || '',
                payment: buildingData.payment || '',
                renttime: buildingData.renttime || '',
                decorationtime: buildingData.decorationtime || '',
                brokeragefee: buildingData.brokeragefee || '',
                note: buildingData.note || '',
                managername: buildingData.managername || '',
                managerphonenumber: buildingData.managerphonenumber || '',
                image: buildingData.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
            };

            db.buildings.push(newBuilding);

            // Add rent areas
            if (buildingData.rentAreas && Array.isArray(buildingData.rentAreas)) {
                buildingData.rentAreas.forEach(val => {
                    if (val) {
                        const raId = db.rentAreas.length > 0 ? Math.max(...db.rentAreas.map(r => r.id)) + 1 : 1;
                        db.rentAreas.push({ id: raId, value: parseFloat(val), buildingid: newId });
                    }
                });
            }

            // Add rent types
            if (buildingData.rentTypeIds && Array.isArray(buildingData.rentTypeIds)) {
                buildingData.rentTypeIds.forEach(rtId => {
                    db.buildingRentTypes.push({ buildingid: newId, renttypeid: parseInt(rtId) });
                });
            }

            MockDatabase.saveDB(db);
            return newBuilding;
        }

        return this.httpRequest('/buildings', {
            method: 'POST',
            body: JSON.stringify(buildingData)
        });
    },

    async updateBuilding(id, buildingData) {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            const idx = db.buildings.findIndex(b => b.id == id);
            if (idx !== -1) {
                db.buildings[idx] = {
                    ...db.buildings[idx],
                    ...buildingData,
                    districtid: parseInt(buildingData.districtid),
                    rentprice: parseFloat(buildingData.rentprice)
                };

                // Update Rent Areas
                if (buildingData.rentAreas) {
                    db.rentAreas = db.rentAreas.filter(ra => ra.buildingid != id);
                    buildingData.rentAreas.forEach(val => {
                        if (val) {
                            const raId = db.rentAreas.length > 0 ? Math.max(...db.rentAreas.map(r => r.id)) + 1 : 1;
                            db.rentAreas.push({ id: raId, value: parseFloat(val), buildingid: parseInt(id) });
                        }
                    });
                }

                // Update Rent Types
                if (buildingData.rentTypeIds) {
                    db.buildingRentTypes = db.buildingRentTypes.filter(brt => brt.buildingid != id);
                    buildingData.rentTypeIds.forEach(rtId => {
                        db.buildingRentTypes.push({ buildingid: parseInt(id), renttypeid: parseInt(rtId) });
                    });
                }

                MockDatabase.saveDB(db);
                return db.buildings[idx];
            }
            throw new Error('Building not found');
        }

        return this.httpRequest(`/buildings/${id}`, {
            method: 'PUT',
            body: JSON.stringify(buildingData)
        });
    },

    async deleteBuilding(id) {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            db.buildings = db.buildings.filter(b => b.id != id);
            db.rentAreas = db.rentAreas.filter(ra => ra.buildingid != id);
            db.buildingRentTypes = db.buildingRentTypes.filter(brt => brt.buildingid != id);
            db.assignmentBuildings = db.assignmentBuildings.filter(ab => ab.buildingid != id);
            MockDatabase.saveDB(db);
            return { success: true };
        }

        return this.httpRequest(`/buildings/${id}`, {
            method: 'DELETE'
        });
    },

    // ==========================================
    // 4. BUILDING ASSIGNMENT API
    // Spring Boot Endpoint: POST /api/buildings/{id}/assignment
    // Body: { staffIds: [2, 3] }
    // ==========================================
    async assignBuildingStaff(buildingId, staffIds) {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            db.assignmentBuildings = db.assignmentBuildings.filter(ab => ab.buildingid != buildingId);
            staffIds.forEach(sid => {
                db.assignmentBuildings.push({ staffid: parseInt(sid), buildingid: parseInt(buildingId) });
            });
            MockDatabase.saveDB(db);
            return { success: true };
        }

        return this.httpRequest(`/buildings/${buildingId}/assignment`, {
            method: 'POST',
            body: JSON.stringify({ staffIds })
        });
    },

    // ==========================================
    // 5. CUSTOMER API
    // Spring Boot Endpoints:
    // GET    /api/customers
    // POST   /api/customers
    // PUT    /api/customers/{id}
    // DELETE /api/customers/{id}
    // POST   /api/customers/{id}/assignment
    // ==========================================
    async getCustomers() {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            return db.customers.map(c => {
                const assignedStaffIds = db.assignmentCustomers.filter(ac => ac.customerid == c.id).map(ac => ac.staffid);
                const assignedStaffNames = db.users.filter(u => assignedStaffIds.includes(u.id)).map(u => u.fullname);
                return {
                    ...c,
                    assignedStaffIds,
                    assignedStaffNames
                };
            });
        }
        return this.httpRequest('/customers');
    },

    async createCustomer(customerData) {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            const newId = db.customers.length > 0 ? Math.max(...db.customers.map(c => c.id)) + 1 : 1;
            const newCustomer = {
                id: newId,
                fullname: customerData.fullname,
                phone: customerData.phone,
                email: customerData.email || ''
            };
            db.customers.push(newCustomer);
            MockDatabase.saveDB(db);
            return newCustomer;
        }

        return this.httpRequest('/customers', {
            method: 'POST',
            body: JSON.stringify(customerData)
        });
    },

    async updateCustomer(id, customerData) {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            const idx = db.customers.findIndex(c => c.id == id);
            if (idx !== -1) {
                db.customers[idx] = { ...db.customers[idx], ...customerData };
                MockDatabase.saveDB(db);
                return db.customers[idx];
            }
            throw new Error('Customer not found');
        }

        return this.httpRequest(`/customers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(customerData)
        });
    },

    async deleteCustomer(id) {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            db.customers = db.customers.filter(c => c.id != id);
            db.assignmentCustomers = db.assignmentCustomers.filter(ac => ac.customerid != id);
            db.transactions = db.transactions.filter(t => t.customerid != id);
            MockDatabase.saveDB(db);
            return { success: true };
        }

        return this.httpRequest(`/customers/${id}`, {
            method: 'DELETE'
        });
    },

    async assignCustomerStaff(customerId, staffIds) {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            db.assignmentCustomers = db.assignmentCustomers.filter(ac => ac.customerid != customerId);
            staffIds.forEach(sid => {
                db.assignmentCustomers.push({ staffid: parseInt(sid), customerid: parseInt(customerId) });
            });
            MockDatabase.saveDB(db);
            return { success: true };
        }

        return this.httpRequest(`/customers/${customerId}/assignment`, {
            method: 'POST',
            body: JSON.stringify({ staffIds })
        });
    },

    // ==========================================
    // 6. TRANSACTION API
    // Spring Boot Endpoints:
    // GET  /api/transactions?customerId=...
    // POST /api/transactions
    // GET  /api/transaction-types
    // ==========================================
    async getTransactionTypes() {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            return db.transactionTypes;
        }
        return this.httpRequest('/transaction-types');
    },

    async getTransactionsByCustomer(customerId) {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            const list = customerId 
                ? db.transactions.filter(t => t.customerid == customerId)
                : db.transactions;
            
            return list.map(t => {
                const customer = db.customers.find(c => c.id == t.customerid);
                const typeObj = db.transactionTypes.find(tt => tt.code === t.type);
                return {
                    ...t,
                    customerName: customer ? customer.fullname : 'Khách hàng',
                    typeName: typeObj ? typeObj.name : t.type
                };
            });
        }
        return this.httpRequest(`/transactions?customerId=${customerId || ''}`);
    },

    async createTransaction(transactionData) {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            const newId = db.transactions.length > 0 ? Math.max(...db.transactions.map(t => t.id)) + 1 : 1;
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 19).replace('T', ' ');
            
            const currentUser = Auth.getCurrentUser();

            const newTx = {
                id: newId,
                note: transactionData.note,
                customerid: parseInt(transactionData.customerid),
                type: transactionData.type,
                createddate: dateStr,
                createdby: currentUser ? currentUser.username : 'system'
            };

            db.transactions.unshift(newTx);
            MockDatabase.saveDB(db);
            return newTx;
        }

        return this.httpRequest('/transactions', {
            method: 'POST',
            body: JSON.stringify(transactionData)
        });
    },

    // ==========================================
    // 7. USER & ROLE MANAGEMENT API
    // Spring Boot Endpoints:
    // GET    /api/users
    // POST   /api/users
    // PUT    /api/users/{id}
    // PUT    /api/users/{id}/status?status=1
    // POST   /api/users/login
    // ==========================================
    async getUsers() {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            return db.users.map(u => {
                const userRoleEntries = db.userRoles.filter(ur => ur.userid == u.id);
                const roles = db.roles.filter(r => userRoleEntries.some(ur => ur.roleid == r.id));
                return {
                    ...u,
                    roles: roles.map(r => r.code),
                    roleNames: roles.map(r => r.name)
                };
            });
        }
        return this.httpRequest('/users');
    },

    async createUser(userData) {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            const newId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
            const newUser = {
                id: newId,
                username: userData.username,
                password: userData.password || '123',
                fullname: userData.fullname,
                phone: userData.phone || '',
                email: userData.email || '',
                status: parseInt(userData.status) !== undefined ? parseInt(userData.status) : 1
            };

            db.users.push(newUser);

            // Assign Roles
            if (userData.roleCodes && Array.isArray(userData.roleCodes)) {
                userData.roleCodes.forEach(rCode => {
                    const rObj = db.roles.find(r => r.code === rCode);
                    if (rObj) {
                        db.userRoles.push({ userid: newId, roleid: rObj.id });
                    }
                });
            }

            MockDatabase.saveDB(db);
            return newUser;
        }

        return this.httpRequest('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async updateUser(id, userData) {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            const idx = db.users.findIndex(u => u.id == id);
            if (idx !== -1) {
                db.users[idx] = { ...db.users[idx], ...userData };

                if (userData.roleCodes) {
                    db.userRoles = db.userRoles.filter(ur => ur.userid != id);
                    userData.roleCodes.forEach(rCode => {
                        const rObj = db.roles.find(r => r.code === rCode);
                        if (rObj) {
                            db.userRoles.push({ userid: parseInt(id), roleid: rObj.id });
                        }
                    });
                }

                MockDatabase.saveDB(db);
                return db.users[idx];
            }
            throw new Error('User not found');
        }

        return this.httpRequest(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    async toggleUserStatus(id) {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            const user = db.users.find(u => u.id == id);
            if (user) {
                user.status = user.status === 1 ? 0 : 1;
                MockDatabase.saveDB(db);
                return user;
            }
            throw new Error('User not found');
        }

        return this.httpRequest(`/users/${id}/status`, {
            method: 'PUT'
        });
    },

    async login(username, password) {
        if (CONFIG.MODE === 'MOCK') {
            const db = MockDatabase.getDB();
            const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
            
            if (!user) {
                throw new Error('Tài khoản hoặc mật khẩu không chính xác!');
            }

            if (user.status !== 1) {
                throw new Error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Quản lý.');
            }

            const userRoles = db.userRoles.filter(ur => ur.userid == user.id);
            const roles = db.roles.filter(r => userRoles.some(ur => ur.roleid == r.id)).map(r => r.code);

            const authUser = {
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                roles: roles
            };

            const token = `mock-jwt-token-${Date.now()}`;
            localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(authUser));

            return { token, user: authUser };
        }

        return this.httpRequest('/users/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    }
};

if (typeof window !== 'undefined') {
    window.ApiService = ApiService;
}
