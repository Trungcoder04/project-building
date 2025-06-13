package com.estatebasic.repository;
import com.estatebasic.entity.RentTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RentTypeRepository extends JpaRepository<RentTypeEntity, Long> {
    RentTypeEntity findByCode(String code);
}
