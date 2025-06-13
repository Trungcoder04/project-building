package com.estatebasic.service;

import com.estatebasic.dto.DistrictDTO;
import com.estatebasic.dto.RentTypeDTO;

import java.util.List;

public interface CategoryService {
    List<DistrictDTO> getDistricts();
    List<RentTypeDTO> getRentTypes();
}
