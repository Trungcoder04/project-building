package com.estatebasic.entity;


import java.io.Serializable;

import jakarta.persistence.*;

@Entity
@Table(name = "renttype")
public class RentTypeEntity implements Serializable{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	
	private Long id;
	
	@Column(name = "code")
	private String code;
	
	@Column(name = "name")
	private String name;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	
}
