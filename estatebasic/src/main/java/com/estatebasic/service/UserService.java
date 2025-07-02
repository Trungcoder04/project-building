package com.estatebasic.service;

import com.estatebasic.dto.LoginDTO;
import com.estatebasic.dto.UserDTO;
import java.util.List;
import java.util.Map;

public interface UserService {
    Map<String, Object> login(LoginDTO loginDTO);
    List<UserDTO> getUsers();
    UserDTO saveUser(UserDTO userDTO);
    UserDTO updateUser(Long id, UserDTO userDTO);
    UserDTO toggleUserStatus(Long id);
}
