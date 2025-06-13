package com.estatebasic.repository;
import com.estatebasic.entity.DistrictEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface DistrictRepository extends JpaRepository<DistrictEntity, Long> {
    DistrictEntity findByCode(String code);
}