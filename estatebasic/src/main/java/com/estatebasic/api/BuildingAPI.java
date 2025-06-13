package com.estatebasic.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.estatebasic.dto.AssignmentBuildingDTO;
import com.estatebasic.dto.BuildingDTO;
import com.estatebasic.service.BuildingService;

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
    
 // Thêm mới 1 Tòa nhà
    @PostMapping
    public BuildingDTO createBuilding(@RequestBody BuildingDTO buildingDTO) {
        return buildingService.saveBuilding(buildingDTO);
    }

 // Cập nhật thông tin 1 Tòa nhà theo ID
    @PutMapping("/{id}")
    public BuildingDTO updateBuilding(@PathVariable Long id, @RequestBody BuildingDTO buildingDTO) {
        return buildingService.updateBuilding(id, buildingDTO);
    }

    // Xóa 1 Tòa nhà theo ID
    @DeleteMapping("/{id}")
    public void deleteBuilding(@PathVariable Long id) {
        buildingService.deleteBuilding(id);
    }
    
 // Phân công Nhân viên quản lý Tòa nhà
    @PostMapping("/{id}/assignment")
    public void assignStaff(@PathVariable Long id, @RequestBody AssignmentBuildingDTO dto) {
        buildingService.assignStaff(id, dto.getStaffIds());
    }


}
