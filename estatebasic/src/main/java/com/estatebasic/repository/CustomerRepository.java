package com.estatebasic.repository;

import com.estatebasic.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerEntity, Long> {
    List<CustomerEntity> findByFullNameContainingOrPhoneContaining(String fullName, String phone);
    CustomerEntity findByPhone(String phone);
}
