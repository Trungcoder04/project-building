package com.estatebasic.api;

import com.estatebasic.dto.DistrictDTO;
import com.estatebasic.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/districts")
@CrossOrigin(origins = "*")
public class DistrictAPI {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<DistrictDTO> getDistricts() {
        return categoryService.getDistricts();
    }
}
