package com.estatebasic.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.estatebasic.entity.BuildingEntity;

@Repository
public interface BuildingRepository extends JpaRepository<BuildingEntity, Long>{
	List<BuildingEntity> findByNameContaining(String name);
	List<BuildingEntity> findByDistrictId(Long DistrictId);
	List<BuildingEntity> findByNameContainingAndDistrictId(String name, Long districtId);
}
