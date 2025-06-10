package com.estatebasic.service;

import java.util.List;

import com.estatebasic.dto.BuildingDTO;

public interface BuildingService {
	List<BuildingDTO> searchBuildings(String name, Long districtId);
	BuildingDTO findBuildingById(Long id);
	BuildingDTO saveBuilding(BuildingDTO buildingDTO);
	BuildingDTO updateBuilding(Long id, BuildingDTO buildingDTO);
	void deleteBuilding(Long id);
	void assignStaff(Long buildingId, List<Long> staffIds);
}
