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
    @Override
    public BuildingDTO findBuildingById(Long id) {
        BuildingEntity entity = buildingRepository.findById(id).orElse(null);
        if (entity == null) {
            return null;
        }

        BuildingDTO dto = new BuildingDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setStreet(entity.getStreet());
        dto.setWard(entity.getWard());
        dto.setDistrictId(entity.getDistrictId());
        dto.setStructure(entity.getStructure());
        dto.setNumberOfBasement(entity.getNumberOfBasement());
        dto.setFloorArea(entity.getFloorArea());
        dto.setDirection(entity.getDirection());
        dto.setLevel(entity.getLevel());
        dto.setRentPrice(entity.getRentPrice());
        dto.setRentPriceDescription(entity.getRentPriceDescription());
        dto.setServiceFee(entity.getServiceFee());
        dto.setCarFee(entity.getCarFee());
        dto.setMotorbikeFee(entity.getMotorbikeFee());
        dto.setOvertimeFee(entity.getOvertimeFee());
        dto.setWaterFee(entity.getWaterFee());
        dto.setElectricityFee(entity.getElectricityFee());
        dto.setDeposit(entity.getDeposit());
        dto.setPayment(entity.getPayment());
        dto.setRentTime(entity.getRentTime());
        dto.setDecorationTime(entity.getDecorationTime());
        dto.setBrokerageFee(entity.getBrokerageFee());
        dto.setNote(entity.getNote());
        dto.setManagerName(entity.getManagerName());
        dto.setManagerPhoneNumber(entity.getManagerPhoneNumber());

        if (entity.getDistrictId() != null) {
            DistrictEntity district = districtRepository.findById(entity.getDistrictId()).orElse(null);
            if (district != null) {
                dto.setDistrictName(district.getName());
            }
        }
        return dto;
    }

}
