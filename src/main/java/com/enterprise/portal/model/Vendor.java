package com.enterprise.portal.model;

import java.time.LocalDateTime;

public class Vendor {
    private int id;
    private String companyName;
    private String contactEmail;
    private String phone;
    private String specialization;
    private LocalDateTime createdAt;

    public Vendor() {}

    public Vendor(int id, String companyName, String contactEmail, String phone, String specialization, LocalDateTime createdAt) {
        this.id = id;
        this.companyName = companyName;
        this.contactEmail = contactEmail;
        this.phone = phone;
        this.specialization = specialization;
        this.createdAt = createdAt;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
