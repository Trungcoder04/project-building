package com.estatebasic.dto;

import java.io.Serializable;
import java.util.List;

public class AssignmentBuildingDTO implements Serializable {
    private List<Long> staffIds;

    public List<Long> getStaffIds() { return staffIds; }
    public void setStaffIds(List<Long> staffIds) { this.staffIds = staffIds; }
}
