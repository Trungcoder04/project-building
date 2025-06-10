package com.estatebasic.entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "assignmentbuilding")
public class AssignmentBuildingEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "staffid")
    private Long staffId;

    @Column(name = "buildingid")
    private Long buildingId;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }

    public Long getBuildingId() { return buildingId; }
    public void setBuildingId(Long buildingId) { this.buildingId = buildingId; }
}
