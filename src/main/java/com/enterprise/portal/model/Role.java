package com.enterprise.portal.model;

public enum Role {
    EMPLOYEE,
    TECHNICIAN,
    VENDOR,
    ADMIN;

    public static Role fromString(String value) {
        if (value == null) return EMPLOYEE;
        try {
            return Role.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return EMPLOYEE;
        }
    }
}
