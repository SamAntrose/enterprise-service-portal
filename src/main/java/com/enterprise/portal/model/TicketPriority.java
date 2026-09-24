package com.enterprise.portal.model;

public enum TicketPriority {
    P1_CRITICAL("P1 Critical", 2),
    P2_HIGH("P2 High", 8),
    P3_MEDIUM("P3 Medium", 24),
    P4_LOW("P4 Low", 48);

    private final String displayName;
    private final int slaHours;

    TicketPriority(String displayName, int slaHours) {
        this.displayName = displayName;
        this.slaHours = slaHours;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getSlaHours() {
        return slaHours;
    }

    public static TicketPriority fromString(String value) {
        if (value == null) return P3_MEDIUM;
        try {
            return TicketPriority.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return P3_MEDIUM;
        }
    }
}
