package com.estatebasic.service.impl;

import com.estatebasic.dto.CustomerDTO;
import com.estatebasic.entity.CustomerEntity;
import com.estatebasic.repository.CustomerRepository;
import com.estatebasic.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public List<CustomerDTO> getCustomers() {
        List<CustomerEntity> entities = customerRepository.findAll();
        List<CustomerDTO> results = new ArrayList<>();
        for (CustomerEntity item : entities) {
            CustomerDTO dto = new CustomerDTO();
            dto.setId(item.getId());
            dto.setFullName(item.getFullName());
            dto.setPhone(item.getPhone());
            dto.setEmail(item.getEmail());
            results.add(dto);
        }
        return results;
    }

    @Override
    public CustomerDTO findCustomerById(Long id) {
        CustomerEntity entity = customerRepository.findById(id).orElse(null);
        if (entity == null) return null;

        CustomerDTO dto = new CustomerDTO();
        dto.setId(entity.getId());
        dto.setFullName(entity.getFullName());
        dto.setPhone(entity.getPhone());
        dto.setEmail(entity.getEmail());
        return dto;
    }

    @Override
    public CustomerDTO saveCustomer(CustomerDTO customerDTO) {
        CustomerEntity entity = new CustomerEntity();
        entity.setFullName(customerDTO.getFullName());
        entity.setPhone(customerDTO.getPhone());
        entity.setEmail(customerDTO.getEmail());

        CustomerEntity savedEntity = customerRepository.save(entity);
        customerDTO.setId(savedEntity.getId());
        return customerDTO;
    }

    @Override
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        CustomerEntity entity = customerRepository.findById(id).orElse(null);
        if (entity == null) return null;

        entity.setFullName(customerDTO.getFullName());
        entity.setPhone(customerDTO.getPhone());
        entity.setEmail(customerDTO.getEmail());

        CustomerEntity updatedEntity = customerRepository.save(entity);
        customerDTO.setId(updatedEntity.getId());
        return customerDTO;
    }

    @Override
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}
