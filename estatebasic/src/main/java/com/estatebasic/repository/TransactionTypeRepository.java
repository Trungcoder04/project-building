package com.estatebasic.repository;

import com.estatebasic.entity.TransactionTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionTypeRepository extends JpaRepository<TransactionTypeEntity, Long> {
}
