package com.estatebasic.api;

import com.estatebasic.dto.RentTypeDTO;
import com.estatebasic.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/renttypes")
@CrossOrigin(origins = "*")
public class RentTypeAPI {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<RentTypeDTO> getRentTypes() {
        return categoryService.getRentTypes();
    }
}
