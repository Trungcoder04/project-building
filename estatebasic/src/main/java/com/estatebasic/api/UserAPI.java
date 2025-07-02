package com.estatebasic.api;

import com.estatebasic.dto.LoginDTO;
import com.estatebasic.dto.UserDTO;
import com.estatebasic.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class UserAPI {

    @Autowired
    private UserService userService;

    // API Đăng nhập Hệ thống
    @PostMapping("/api/users/login")
    public Map<String, Object> login(@RequestBody LoginDTO loginDTO) {
        return userService.login(loginDTO);
    }

    // Lấy danh sách Người dùng / Nhân viên
    @GetMapping("/api/users")
    public List<UserDTO> getUsers() {
        return userService.getUsers();
    }

    // Tạo mới Tài khoản Người dùng
    @PostMapping("/api/users")
    public UserDTO createUser(@RequestBody UserDTO userDTO) {
        return userService.saveUser(userDTO);
    }

    // Cập nhật thông tin Tài khoản
    @PutMapping("/api/users/{id}")
    public UserDTO updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        return userService.updateUser(id, userDTO);
    }

    // Bật / Tắt trạng thái Tài khoản (Active / Inactive)
    @PutMapping("/api/users/{id}/status")
    public UserDTO toggleUserStatus(@PathVariable Long id) {
        return userService.toggleUserStatus(id);
    }
}
