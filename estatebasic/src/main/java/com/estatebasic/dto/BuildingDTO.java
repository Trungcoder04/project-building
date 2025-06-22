package com.estatebasic.dto;

import java.io.Serializable;

public class BuildingDTO implements Serializable {
    private Long id;
    private String name;
    private String street;
    private String ward;
    private Long districtId;
    private String districtName;
    private String structure;
    private Double rentPrice;
    private String rentPriceDescription;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public Long getDistrictId() { return districtId; }
    public void setDistrictId(Long districtId) { this.districtId = districtId; }

    public String getDistrictName() { return districtName; }
    public void setDistrictName(String districtName) { this.districtName = districtName; }

    public String getStructure() { return structure; }
    public void setStructure(String structure) { this.structure = structure; }

    public Double getRentPrice() { return rentPrice; }
    public void setRentPrice(Double rentPrice) { this.rentPrice = rentPrice; }

    public String getRentPriceDescription() { return rentPriceDescription; }
    public void setRentPriceDescription(String rentPriceDescription) { this.rentPriceDescription = rentPriceDescription; }
}
