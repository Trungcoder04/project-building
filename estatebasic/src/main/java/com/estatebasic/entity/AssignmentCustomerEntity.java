package com.estatebasic.entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "assignmentcustomer")
public class AssignmentCustomerEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "staffid")
    private Long staffId;

    @Column(name = "customerid")
    private Long customerId;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
}
