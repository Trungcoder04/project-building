package com.estatebasic.api;

import com.estatebasic.dto.CustomerDTO;
import com.estatebasic.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerAPI {

    @Autowired
    private CustomerService customerService;

    // Lấy danh sách tất cả Khách hàng
    @GetMapping
    public List<CustomerDTO> getCustomers() {
        return customerService.getCustomers();
    }

    // Lấy chi tiết 1 Khách hàng theo ID
    @GetMapping("/{id}")
    public CustomerDTO getCustomerById(@PathVariable Long id) {
        return customerService.findCustomerById(id);
    }

    // Thêm mới Khách hàng (dùng cho cả Admin và Form đăng ký Public)
    @PostMapping
    public CustomerDTO createCustomer(@RequestBody CustomerDTO customerDTO) {
        return customerService.saveCustomer(customerDTO);
    }

    // Cập nhật thông tin Khách hàng theo ID
    @PutMapping("/{id}")
    public CustomerDTO updateCustomer(@PathVariable Long id, @RequestBody CustomerDTO customerDTO) {
        return customerService.updateCustomer(id, customerDTO);
    }

    // Xóa Khách hàng theo ID
    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
    }
 // Phân công Nhân viên chăm sóc Khách hàng
    @PostMapping("/{id}/assignment")
    public void assignStaff(@PathVariable Long id, @RequestBody AssignmentCustomerDTO dto) {
        customerService.assignStaff(id, dto.getStaffIds());
    }

}
