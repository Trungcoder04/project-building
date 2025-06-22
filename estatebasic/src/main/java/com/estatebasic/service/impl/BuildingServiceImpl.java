package com.estatebasic.service.impl;

import com.estatebasic.dto.BuildingDTO;
import com.estatebasic.entity.BuildingEntity;
import com.estatebasic.entity.DistrictEntity;
import com.estatebasic.repository.BuildingRepository;
import com.estatebasic.repository.DistrictRepository;
import com.estatebasic.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BuildingServiceImpl implements BuildingService {

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private DistrictRepository districtRepository;

    @Override
    public List<BuildingDTO> searchBuildings(String name, Long districtId) {
        List<BuildingEntity> entities;

        if (name != null && !name.trim().isEmpty() && districtId != null) {
            entities = buildingRepository.findByNameContainingAndDistrictId(name.trim(), districtId);
        } else if (name != null && !name.trim().isEmpty()) {
            entities = buildingRepository.findByNameContaining(name.trim());
        } else if (districtId != null) {
            entities = buildingRepository.findByDistrictId(districtId);
        } else {
            entities = buildingRepository.findAll();
        }

        List<BuildingDTO> results = new ArrayList<>();
        for (BuildingEntity item : entities) {
            BuildingDTO dto = new BuildingDTO();
            dto.setId(item.getId());
            dto.setName(item.getName());
            dto.setStreet(item.getStreet());
            dto.setWard(item.getWard());
            dto.setDistrictId(item.getDistrictId());
            dto.setStructure(item.getStructure());
            dto.setRentPrice(item.getRentPrice());
            dto.setRentPriceDescription(item.getRentPriceDescription());

            if (item.getDistrictId() != null) {
                DistrictEntity district = districtRepository.findById(item.getDistrictId()).orElse(null);
                if (district != null) dto.setDistrictName(district.getName());
            }

            results.add(dto);
        }
        return results;
    }
}
