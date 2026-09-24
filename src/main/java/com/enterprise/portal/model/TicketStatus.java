package com.enterprise.portal.model;

public enum TicketStatus {
    SUBMITTED,
    AI_ANALYZED,
    ASSIGNED,
    IN_PROGRESS,
    RESOLVED,
    CLOSED;

    public static TicketStatus fromString(String value) {
        if (value == null) return SUBMITTED;
        try {
            return TicketStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return SUBMITTED;
        }
    }
}
