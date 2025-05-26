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
    private Integer numberOfBasement;
    private Integer floorArea;
    private String direction;
    private String level;
    private Double rentPrice;
    private String rentPriceDescription;
    private String serviceFee;
    private String carFee;
    private String motorbikeFee;
    private String overtimeFee;
    private String waterFee;
    private String electricityFee;
    private String deposit;
    private String payment;
    private String rentTime;
    private String decorationTime;
    private String brokerageFee;
    private String note;
    private String managerName;
    private String managerPhoneNumber;

    // Getters and Setters đầy đủ cho tất cả các biến trên
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

    public Integer getNumberOfBasement() { return numberOfBasement; }
    public void setNumberOfBasement(Integer numberOfBasement) { this.numberOfBasement = numberOfBasement; }

    public Integer getFloorArea() { return floorArea; }
    public void setFloorArea(Integer floorArea) { this.floorArea = floorArea; }

    public String getDirection() { return direction; }
    public void setDirection(String direction) { this.direction = direction; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public Double getRentPrice() { return rentPrice; }
    public void setRentPrice(Double rentPrice) { this.rentPrice = rentPrice; }

    public String getRentPriceDescription() { return rentPriceDescription; }
    public void setRentPriceDescription(String rentPriceDescription) { this.rentPriceDescription = rentPriceDescription; }

    public String getServiceFee() { return serviceFee; }
    public void setServiceFee(String serviceFee) { this.serviceFee = serviceFee; }

    public String getCarFee() { return carFee; }
    public void setCarFee(String carFee) { this.carFee = carFee; }

    public String getMotorbikeFee() { return motorbikeFee; }
    public void setMotorbikeFee(String motorbikeFee) { this.motorbikeFee = motorbikeFee; }

    public String getOvertimeFee() { return overtimeFee; }
    public void setOvertimeFee(String overtimeFee) { this.overtimeFee = overtimeFee; }

    public String getWaterFee() { return waterFee; }
    public void setWaterFee(String waterFee) { this.waterFee = waterFee; }

    public String getElectricityFee() { return electricityFee; }
    public void setElectricityFee(String electricityFee) { this.electricityFee = electricityFee; }

    public String getDeposit() { return deposit; }
    public void setDeposit(String deposit) { this.deposit = deposit; }

    public String getPayment() { return payment; }
    public void setPayment(String payment) { this.payment = payment; }

    public String getRentTime() { return rentTime; }
    public void setRentTime(String rentTime) { this.rentTime = rentTime; }

    public String getDecorationTime() { return decorationTime; }
    public void setDecorationTime(String decorationTime) { this.decorationTime = decorationTime; }

    public String getBrokerageFee() { return brokerageFee; }
    public void setBrokerageFee(String brokerageFee) { this.brokerageFee = brokerageFee; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public String getManagerPhoneNumber() { return managerPhoneNumber; }
    public void setManagerPhoneNumber(String managerPhoneNumber) { this.managerPhoneNumber = managerPhoneNumber; }
}
