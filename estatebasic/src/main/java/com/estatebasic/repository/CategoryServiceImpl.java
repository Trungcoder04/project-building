package com.estatebasic.service.impl;

import com.estatebasic.dto.DistrictDTO;
import com.estatebasic.dto.RentTypeDTO;
import com.estatebasic.entity.DistrictEntity;
import com.estatebasic.entity.RentTypeEntity;
import com.estatebasic.repository.DistrictRepository;
import com.estatebasic.repository.RentTypeRepository;
import com.estatebasic.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private RentTypeRepository rentTypeRepository;

    @Override
    public List<DistrictDTO> getDistricts() {
        List<DistrictEntity> entities = districtRepository.findAll();
        List<DistrictDTO> results = new ArrayList<>();
        for (DistrictEntity item : entities) {
            DistrictDTO dto = new DistrictDTO();
            dto.setId(item.getId());
            dto.setCode(item.getCode());
            dto.setName(item.getName());
            results.add(dto);
        }
        return results;
    }

    @Override
    public List<RentTypeDTO> getRentTypes() {
        List<RentTypeEntity> entities = rentTypeRepository.findAll();
        List<RentTypeDTO> results = new ArrayList<>();
        for (RentTypeEntity item : entities) {
            RentTypeDTO dto = new RentTypeDTO();
            dto.setId(item.getId());
            dto.setCode(item.getCode());
            dto.setName(item.getName());
            results.add(dto);
        }
        return results;
    }
}
