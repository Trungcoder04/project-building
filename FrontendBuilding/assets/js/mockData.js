/**
 * EstateBasic - Initial Mock Database
 * Strictly based on Database Schema:
 * 1. User(id, username, password, fullname, phone, email, status)
 * 2. Role(id, code, name) & User_Role(userid, roleid)
 * 3. District(id, code, name)
 * 4. RentType(id, code, name)
 * 5. Building(...)
 * 6. RentArea(id, value, buildingid)
 * 7. BuildingRentType(buildingid, renttypeid)
 * 8. Customer(id, fullname, phone, email)
 * 9. AssignmentBuilding(staffid, buildingid)
 * 10. AssignmentCustomer(staffid, customerid)
 * 11. TransactionType(id, code, name)
 * 12. Transaction(id, note, customerid, type, createddate, createdby)
 */

const INITIAL_MOCK_DATA = {
    roles: [
        { id: 1, code: 'MANAGER', name: 'Quản Lý Hệ Thống' },
        { id: 2, code: 'STAFF', name: 'Nhân Viên Kinh Doanh' }
    ],
    users: [
        { id: 1, username: 'manager', password: '123', fullname: 'Nguyễn Văn Quản Lý', phone: '0901234567', email: 'manager@estatebasic.com', status: 1 },
        { id: 2, username: 'staff1', password: '123', fullname: 'Trần Thị Thu Hà', phone: '0912345678', email: 'ha.tran@estatebasic.com', status: 1 },
        { id: 3, username: 'staff2', password: '123', fullname: 'Lê Minh Tuấn', phone: '0923456789', email: 'tuan.le@estatebasic.com', status: 1 },
        { id: 4, username: 'staff3', password: '123', fullname: 'Phạm Hoàng Nam', phone: '0934567890', email: 'nam.pham@estatebasic.com', status: 0 }
    ],
    userRoles: [
        { userid: 1, roleid: 1 }, // manager -> MANAGER
        { userid: 2, roleid: 2 }, // staff1 -> STAFF
        { userid: 3, roleid: 2 }, // staff2 -> STAFF
        { userid: 4, roleid: 2 }  // staff3 -> STAFF
    ],
    districts: [
        { id: 1, code: 'Q1', name: 'Quận 1' },
        { id: 2, code: 'Q3', name: 'Quận 3' },
        { id: 3, code: 'Q7', name: 'Quận 7' },
        { id: 4, code: 'QBT', name: 'Quận Bình Thạnh' },
        { id: 5, code: 'QTD', name: 'TP. Thủ Đức' }
    ],
    rentTypes: [
        { id: 1, code: 'TANG_TRET', name: 'Tầng trệt' },
        { id: 2, code: 'NGUYEN_CAN', name: 'Nguyên căn' },
        { id: 3, code: 'NOI_THAT', name: 'Nội thất cao cấp' },
        { id: 4, code: 'VAN_PHONG_TRON_GOI', name: 'Văn phòng trọn gói' }
    ],
    buildings: [
        {
            id: 1,
            name: 'Landmark 81 Commercial Center',
            street: '720A Điện Biên Phủ',
            ward: 'Phường 22',
            districtid: 4, // QBT
            structure: '81 tầng cao, 3 tầng hầm',
            numberofbasement: 3,
            floorarea: 1200,
            direction: 'Đông Nam',
            level: 'Hạng A+',
            rentprice: 35, // USD/m2 or tr/m2
            rentpricedescription: '35 USD/m2/tháng (chưa bao gồm VAT & PQL)',
            servicefee: '6.5 USD/m2',
            carfee: '2.500.000 VNĐ/xe/tháng',
            motorbikefee: '250.000 VNĐ/xe/tháng',
            overtimefee: 'Thỏa thuận theo diện tích',
            waterfee: 'Theo giá nhà nước',
            electricityfee: 'Tính theo đồng hồ riêng',
            deposit: '3 tháng',
            payment: 'Thanh toán 3 tháng/lần',
            renttime: 'Tối thiểu 3 năm',
            decorationtime: '30 ngày free',
            brokeragefee: '1 tháng tiền thuê',
            note: 'Tòa nhà biểu tượng cao nhất TP.HCM, trang thiết bị hiện đại chuẩn quốc tế.',
            managername: 'Nguyễn Văn Quản Lý',
            managerphonenumber: '0901234567',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 2,
            name: 'Bitexco Financial Tower',
            street: '2 Hải Triều',
            ward: 'Phường Bến Nghé',
            districtid: 1, // Q1
            structure: '68 tầng cao, 3 tầng hầm',
            numberofbasement: 3,
            floorarea: 1000,
            direction: 'Nam',
            level: 'Hạng A',
            rentprice: 42,
            rentpricedescription: '42 USD/m2/tháng',
            servicefee: '8 USD/m2',
            carfee: '3.000.000 VNĐ/xe/tháng',
            motorbikefee: '300.000 VNĐ/xe/tháng',
            overtimefee: '0.12 USD/m2/giờ',
            waterfee: 'Đã bao gồm trong phí dịch vụ',
            electricityfee: 'Theo công tơ điện lực',
            deposit: '3 tháng',
            payment: 'Thanh toán theo quý',
            renttime: 'Tối thiểu 2 năm',
            decorationtime: '45 ngày',
            brokeragefee: '100% tháng đầu',
            note: 'Vị trí đắc địa ngay trung tâm tài chính Quận 1, tầm nhìn hướng sông Sài Gòn.',
            managername: 'Trần Thị Thu Hà',
            managerphonenumber: '0912345678',
            image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 3,
            name: 'Crescent Plaza Building',
            street: '105 Tôn Dật Tiên',
            ward: 'Phường Tân Phú',
            districtid: 3, // Q7
            structure: '12 tầng cao, 2 tầng hầm',
            numberofbasement: 2,
            floorarea: 850,
            direction: 'Tây Bắc',
            level: 'Hạng B+',
            rentprice: 22,
            rentpricedescription: '22 USD/m2/tháng',
            servicefee: '4.5 USD/m2',
            carfee: '1.800.000 VNĐ/xe/tháng',
            motorbikefee: '180.000 VNĐ/xe/tháng',
            overtimefee: 'Miễn phí trước 22h',
            waterfee: 'Tính theo chỉ số thực tế',
            electricityfee: 'Giá điện lực kinh doanh',
            deposit: '2 tháng',
            payment: 'Thanh toán từng tháng hoặc 3 tháng',
            renttime: 'Tối thiểu 1 năm',
            decorationtime: '15 ngày',
            brokeragefee: '0.8 tháng tiền thuê',
            note: 'Nằm trong khu đô thị Phú Mỹ Hưng, không gian xanh thoáng mát, bãi xe rộng rãi.',
            managername: 'Lê Minh Tuấn',
            managerphonenumber: '0923456789',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 4,
            name: 'Saigon Centre Tower 2',
            street: '67 Lê Lợi',
            ward: 'Phường Bến Nghé',
            districtid: 1, // Q1
            structure: '42 tầng cao, 6 tầng hầm',
            numberofbasement: 6,
            floorarea: 2000,
            direction: 'Đông',
            level: 'Hạng A+',
            rentprice: 50,
            rentpricedescription: '50 USD/m2/tháng',
            servicefee: '7.5 USD/m2',
            carfee: '3.500.000 VNĐ/xe/tháng',
            motorbikefee: '350.000 VNĐ/xe/tháng',
            overtimefee: 'Thỏa thuận',
            waterfee: 'Mễn phí nước sinh hoạt',
            electricityfee: 'Giá nhà nước',
            deposit: '3 tháng',
            payment: 'Thanh toán hàng quý',
            renttime: 'Tối thiểu 3 năm',
            decorationtime: '30 ngày',
            brokeragefee: '1 tháng tiền thuê',
            note: 'Tòa nhà phức hợp thương mại và văn phòng tiêu chuẩn LEED Gold.',
            managername: 'Nguyễn Văn Quản Lý',
            managerphonenumber: '0901234567',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
        }
    ],
    rentAreas: [
        { id: 1, value: 100, buildingid: 1 },
        { id: 2, value: 250, buildingid: 1 },
        { id: 3, value: 500, buildingid: 1 },
        { id: 4, value: 150, buildingid: 2 },
        { id: 5, value: 300, buildingid: 2 },
        { id: 6, value: 80, buildingid: 3 },
        { id: 7, value: 200, buildingid: 3 },
        { id: 8, value: 400, buildingid: 3 },
        { id: 9, value: 350, buildingid: 4 },
        { id: 10, value: 700, buildingid: 4 }
    ],
    buildingRentTypes: [
        { buildingid: 1, renttypeid: 1 }, // Tầng trệt
        { buildingid: 1, renttypeid: 3 }, // Nội thất
        { buildingid: 2, renttypeid: 3 }, // Nội thất
        { buildingid: 2, renttypeid: 4 }, // Trọn gói
        { buildingid: 3, renttypeid: 2 }, // Nguyên căn
        { buildingid: 3, renttypeid: 4 }, // Trọn gói
        { buildingid: 4, renttypeid: 1 }, // Tầng trệt
        { buildingid: 4, renttypeid: 3 }  // Nội thất
    ],
    customers: [
        { id: 1, fullname: 'Nguyễn Thị Minh Anh', phone: '0988776655', email: 'minhanh.nguyen@techcorp.vn' },
        { id: 2, fullname: 'Công ty TNHH Giải Pháp Phần Mềm SoftTech', phone: '02838999888', email: 'contact@softtech.com.vn' },
        { id: 3, fullname: 'Đặng Quốc Huy', phone: '0977665544', email: 'huy.dang@gmail.com' }
    ],
    assignmentBuildings: [
        { staffid: 2, buildingid: 1 },
        { staffid: 2, buildingid: 2 },
        { staffid: 3, buildingid: 3 },
        { staffid: 3, buildingid: 4 }
    ],
    assignmentCustomers: [
        { staffid: 2, customerid: 1 },
        { staffid: 2, customerid: 2 },
        { staffid: 3, customerid: 3 }
    ],
    transactionTypes: [
        { id: 1, code: 'CHAM_SOC', name: 'Chăm sóc khách hàng' },
        { id: 2, code: 'DAN_DI_XEM', name: 'Dẫn đi xem tòa nhà' },
        { id: 3, code: 'TU_VAN', name: 'Tư vấn hợp đồng & báo giá' },
        { id: 4, code: 'DAT_COC', name: 'Đặt cọc & Ký HĐ' }
    ],
    transactions: [
        { id: 1, note: 'Khách yêu cầu báo giá diện tích 250m2 tại Landmark 81', customerid: 1, type: 'TU_VAN', createddate: '2026-07-10 09:30:00', createdby: 'staff1' },
        { id: 2, note: 'Đã dẫn đại diện SoftTech đi khảo sát thực tế Bitexco tầng 25', customerid: 2, type: 'DAN_DI_XEM', createddate: '2026-07-15 14:00:00', createdby: 'staff1' },
        { id: 3, note: 'Khách hàng chốt cọc giữ vị trí Crescent Plaza diện tích 200m2', customerid: 3, type: 'DAT_COC', createddate: '2026-07-20 16:45:00', createdby: 'staff2' }
    ]
};

// Helper class for LocalStorage Persistence
class MockDatabase {
    static getDB() {
        const data = localStorage.getItem(CONFIG.STORAGE_KEYS.MOCK_DB);
        if (!data) {
            this.saveDB(INITIAL_MOCK_DATA);
            return INITIAL_MOCK_DATA;
        }
        return JSON.parse(data);
    }

    static saveDB(db) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.MOCK_DB, JSON.stringify(db));
    }

    static resetDB() {
        this.saveDB(INITIAL_MOCK_DATA);
        return INITIAL_MOCK_DATA;
    }
}

if (typeof window !== 'undefined') {
    window.MockDatabase = MockDatabase;
}
