package com.estatebasic.repository;

import com.estatebasic.entity.AssignmentBuildingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentBuildingRepository extends JpaRepository<AssignmentBuildingEntity, Long> {
    List<AssignmentBuildingEntity> findByBuildingId(Long buildingId);
    void deleteByBuildingId(Long buildingId);
}
