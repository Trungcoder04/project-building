package com.estatebasic.api;

import com.estatebasic.dto.BuildingDTO;
import com.estatebasic.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buildings")
@CrossOrigin(origins = "*")
public class BuildingAPI {

    @Autowired
    private BuildingService buildingService;

    @GetMapping
    public List<BuildingDTO> searchBuildings(@RequestParam(required = false) String name,
                                            @RequestParam(required = false) Long districtId) {
        return buildingService.searchBuildings(name, districtId);
    }
    
 // Lấy chi tiết 1 tòa nhà theo ID
    @GetMapping("/{id}")
    public BuildingDTO getBuildingById(@PathVariable Long id) {
        return buildingService.findBuildingById(id);
    }

}
