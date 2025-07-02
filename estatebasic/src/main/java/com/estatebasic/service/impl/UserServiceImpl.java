package com.estatebasic.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.estatebasic.dto.LoginDTO;
import com.estatebasic.dto.UserDTO;
import com.estatebasic.entity.RoleEntity;
import com.estatebasic.entity.UserEntity;
import com.estatebasic.entity.UserRoleEntity;
import com.estatebasic.repository.RoleRepository;
import com.estatebasic.repository.UserRepository;
import com.estatebasic.repository.UserRoleRepository;
import com.estatebasic.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Override
    public Map<String, Object> login(LoginDTO loginDTO) {
        UserEntity user = userRepository.findByUserNameAndPasswordAndStatus(loginDTO.getUsername(), loginDTO.getPassword(), 1)
                .orElseThrow(() -> new RuntimeException("Tài khoản hoặc mật khẩu không chính xác hoặc tài khoản đã bị khóa!"));

        List<UserRoleEntity> userRoles = userRoleRepository.findByUserId(user.getId());
        List<String> roles = new ArrayList<>();
        for (UserRoleEntity ur : userRoles) {
            RoleEntity r = roleRepository.findById(ur.getRoleId()).orElse(null);
            if (r != null) roles.add(r.getCode());
        }

        Map<String, Object> authUser = new HashMap<>();
        authUser.put("id", user.getId());
        authUser.put("username", user.getUserName());
        authUser.put("fullname", user.getFullName());
        authUser.put("email", user.getEmail());
        authUser.put("phone", user.getPhone());
        authUser.put("roles", roles);

        Map<String, Object> response = new HashMap<>();
        response.put("token", "jwt-token-" + System.currentTimeMillis());
        response.put("user", authUser);
        return response;
    }

    @Override
    public List<UserDTO> getUsers() {
        List<UserEntity> entities = userRepository.findAll();
        List<UserDTO> results = new ArrayList<>();
        for (UserEntity item : entities) {
            UserDTO dto = new UserDTO();
            dto.setId(item.getId());
            dto.setUserName(item.getUserName());
            dto.setFullName(item.getFullName());
            dto.setPhone(item.getPhone());
            dto.setEmail(item.getEmail());
            dto.setStatus(item.getStatus());

            List<UserRoleEntity> userRoles = userRoleRepository.findByUserId(item.getId());
            List<String> roleCodes = new ArrayList<>();
            List<String> roleNames = new ArrayList<>();
            for (UserRoleEntity ur : userRoles) {
                RoleEntity r = roleRepository.findById(ur.getRoleId()).orElse(null);
                if (r != null) {
                    roleCodes.add(r.getCode());
                    roleNames.add(r.getName());
                }
            }
            dto.setRoleCodes(roleCodes);
            dto.setRoleNames(roleNames);
            results.add(dto);
        }
        return results;
    }

    @Override
    public UserDTO saveUser(UserDTO userDTO) {
        UserEntity entity = new UserEntity();
        entity.setUserName(userDTO.getUserName());
        entity.setPassword(userDTO.getPassword() != null ? userDTO.getPassword() : "123");
        entity.setFullName(userDTO.getFullName());
        entity.setPhone(userDTO.getPhone());
        entity.setEmail(userDTO.getEmail());
        entity.setStatus(userDTO.getStatus() != null ? userDTO.getStatus() : 1);

        UserEntity savedEntity = userRepository.save(entity);
        userDTO.setId(savedEntity.getId());

        if (userDTO.getRoleCodes() != null) {
            for (String code : userDTO.getRoleCodes()) {
                RoleEntity r = roleRepository.findByCode(code);
                if (r != null) {
                    UserRoleEntity ur = new UserRoleEntity();
                    ur.setUserId(savedEntity.getId());
                    ur.setRoleId(r.getId());
                    userRoleRepository.save(ur);
                }
            }
        }
        return userDTO;
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        UserEntity entity = userRepository.findById(id).orElse(null);
        if (entity == null) return null;

        entity.setFullName(userDTO.getFullName());
        entity.setPhone(userDTO.getPhone());
        entity.setEmail(userDTO.getEmail());
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            entity.setPassword(userDTO.getPassword());
        }

        userRepository.save(entity);

        if (userDTO.getRoleCodes() != null) {
            userRoleRepository.deleteByUserId(id);
            for (String code : userDTO.getRoleCodes()) {
                RoleEntity r = roleRepository.findByCode(code);
                if (r != null) {
                    UserRoleEntity ur = new UserRoleEntity();
                    ur.setUserId(id);
                    ur.setRoleId(r.getId());
                    userRoleRepository.save(ur);
                }
            }
        }
        return userDTO;
    }

    @Override
    public UserDTO toggleUserStatus(Long id) {
        UserEntity entity = userRepository.findById(id).orElse(null);
        if (entity == null) return null;

        entity.setStatus(entity.getStatus() == 1 ? 0 : 1);
        UserEntity updated = userRepository.save(entity);

        UserDTO dto = new UserDTO();
        dto.setId(updated.getId());
        dto.setStatus(updated.getStatus());
        return dto;
    }
}
