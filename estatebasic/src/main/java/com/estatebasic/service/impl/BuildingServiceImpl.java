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

    @Override
    public BuildingDTO saveBuilding(BuildingDTO buildingDTO) {
        BuildingEntity entity = new BuildingEntity();
        entity.setName(buildingDTO.getName());
        entity.setStreet(buildingDTO.getStreet());
        entity.setWard(buildingDTO.getWard());
        entity.setDistrictId(buildingDTO.getDistrictId());
        entity.setStructure(buildingDTO.getStructure());
        entity.setNumberOfBasement(buildingDTO.getNumberOfBasement());
        entity.setFloorArea(buildingDTO.getFloorArea());
        entity.setDirection(buildingDTO.getDirection());
        entity.setLevel(buildingDTO.getLevel());
        entity.setRentPrice(buildingDTO.getRentPrice());
        entity.setRentPriceDescription(buildingDTO.getRentPriceDescription());
        entity.setServiceFee(buildingDTO.getServiceFee());
        entity.setCarFee(buildingDTO.getCarFee());
        entity.setMotorbikeFee(buildingDTO.getMotorbikeFee());
        entity.setOvertimeFee(buildingDTO.getOvertimeFee());
        entity.setWaterFee(buildingDTO.getWaterFee());
        entity.setElectricityFee(buildingDTO.getElectricityFee());
        entity.setDeposit(buildingDTO.getDeposit());
        entity.setPayment(buildingDTO.getPayment());
        entity.setRentTime(buildingDTO.getRentTime());
        entity.setDecorationTime(buildingDTO.getDecorationTime());
        entity.setBrokerageFee(buildingDTO.getBrokerageFee());
        entity.setNote(buildingDTO.getNote());
        entity.setManagerName(buildingDTO.getManagerName());
        entity.setManagerPhoneNumber(buildingDTO.getManagerPhoneNumber());

        // Lưu vào MySQL Database
        BuildingEntity savedEntity = buildingRepository.save(entity);

        // Gán ID mới sinh trả về cho DTO
        buildingDTO.setId(savedEntity.getId());
        return buildingDTO;
    }

    @Override
    public BuildingDTO updateBuilding(Long id, BuildingDTO buildingDTO) {
        BuildingEntity entity = buildingRepository.findById(id).orElse(null);
        if (entity == null) {
            return null;
        }

        entity.setName(buildingDTO.getName());
        entity.setStreet(buildingDTO.getStreet());
        entity.setWard(buildingDTO.getWard());
        entity.setDistrictId(buildingDTO.getDistrictId());
        entity.setStructure(buildingDTO.getStructure());
        entity.setNumberOfBasement(buildingDTO.getNumberOfBasement());
        entity.setFloorArea(buildingDTO.getFloorArea());
        entity.setDirection(buildingDTO.getDirection());
        entity.setLevel(buildingDTO.getLevel());
        entity.setRentPrice(buildingDTO.getRentPrice());
        entity.setRentPriceDescription(buildingDTO.getRentPriceDescription());
        entity.setServiceFee(buildingDTO.getServiceFee());
        entity.setCarFee(buildingDTO.getCarFee());
        entity.setMotorbikeFee(buildingDTO.getMotorbikeFee());
        entity.setOvertimeFee(buildingDTO.getOvertimeFee());
        entity.setWaterFee(buildingDTO.getWaterFee());
        entity.setElectricityFee(buildingDTO.getElectricityFee());
        entity.setDeposit(buildingDTO.getDeposit());
        entity.setPayment(buildingDTO.getPayment());
        entity.setRentTime(buildingDTO.getRentTime());
        entity.setDecorationTime(buildingDTO.getDecorationTime());
        entity.setBrokerageFee(buildingDTO.getBrokerageFee());
        entity.setNote(buildingDTO.getNote());
        entity.setManagerName(buildingDTO.getManagerName());
        entity.setManagerPhoneNumber(buildingDTO.getManagerPhoneNumber());

        BuildingEntity updatedEntity = buildingRepository.save(entity);
        buildingDTO.setId(updatedEntity.getId());
        return buildingDTO;
    }

    @Override
    public void deleteBuilding(Long id) {
        buildingRepository.deleteById(id);
    }

    @Autowired
    private AssignmentBuildingRepository assignmentBuildingRepository;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void assignStaff(Long buildingId, List<Long> staffIds) {
        // 1. Xóa tất cả các phân công cũ của tòa nhà này
        assignmentBuildingRepository.deleteByBuildingId(buildingId);

        // 2. Thêm mới các phân công nhân viên được chọn
        if (staffIds != null && !staffIds.isEmpty()) {
            for (Long staffId : staffIds) {
                AssignmentBuildingEntity entity = new AssignmentBuildingEntity();
                entity.setBuildingId(buildingId);
                entity.setStaffId(staffId);
                assignmentBuildingRepository.save(entity);
            }
        }
    }

}
