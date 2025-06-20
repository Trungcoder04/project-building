package com.estatebasic.service;

import com.estatebasic.dto.CustomerDTO;
import java.util.List;

public interface CustomerService {
    List<CustomerDTO> getCustomers();
    CustomerDTO findCustomerById(Long id);
    CustomerDTO saveCustomer(CustomerDTO customerDTO);
    CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO);
    void deleteCustomer(Long id);
}
