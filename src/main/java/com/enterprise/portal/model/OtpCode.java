package com.enterprise.portal.model;

import java.time.LocalDateTime;

public class OtpCode {
    private int id;
    private String userEmail;
    private String otpCode;
    private LocalDateTime expiresAt;
    private boolean isUsed;
    private LocalDateTime createdAt;

    public OtpCode() {}

    public OtpCode(int id, String userEmail, String otpCode, LocalDateTime expiresAt, boolean isUsed, LocalDateTime createdAt) {
        this.id = id;
        this.userEmail = userEmail;
        this.otpCode = otpCode;
        this.expiresAt = expiresAt;
        this.isUsed = isUsed;
        this.createdAt = createdAt;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public boolean isUsed() { return isUsed; }
    public void setUsed(boolean used) { isUsed = used; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
