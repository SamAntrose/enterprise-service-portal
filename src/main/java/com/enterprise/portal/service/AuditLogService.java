package com.enterprise.portal.service;

import com.enterprise.portal.model.AuditLog;
import com.enterprise.portal.repository.AuditLogRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Async
    @Transactional
    public void logAction(String username, String role, String action, String details) {
        try {
            AuditLog log = new AuditLog();
            log.setUsername(username != null ? username : "System");
            log.setUserRole(role != null ? role : "SYSTEM");
            log.setAction(action);
            log.setDetails(details);
            log.setIpAddress("127.0.0.1");
            auditLogRepository.save(log);
        } catch (Exception e) {
            System.err.println("Failed to write audit log: " + e.getMessage());
        }
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc();
    }
}
