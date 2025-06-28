package com.estatebasic.repository;

import com.estatebasic.entity.AssignmentCustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentCustomerRepository extends JpaRepository<AssignmentCustomerEntity, Long> {
    List<AssignmentCustomerEntity> findByCustomerId(Long customerId);
    void deleteByCustomerId(Long customerId);
}
