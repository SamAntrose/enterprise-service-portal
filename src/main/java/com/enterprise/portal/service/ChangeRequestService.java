package com.enterprise.portal.service;

import com.enterprise.portal.model.ChangeRequest;
import com.enterprise.portal.repository.ChangeRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChangeRequestService {

    private final ChangeRequestRepository changeRequestRepository;
    private final AuditLogService auditLogService;

    public ChangeRequestService(ChangeRequestRepository changeRequestRepository, AuditLogService auditLogService) {
        this.changeRequestRepository = changeRequestRepository;
        this.auditLogService = auditLogService;
    }

    public List<ChangeRequest> getAllChangeRequests() {
        return changeRequestRepository.findAll();
    }

    @Transactional
    public ChangeRequest createChangeRequest(ChangeRequest request, String requestedBy) {
        request.setRequestedBy(requestedBy);
        request.setStatus("Submitted");
        ChangeRequest saved = changeRequestRepository.save(request);
        auditLogService.logAction(requestedBy, "ADMIN", "SUBMIT_CHANGE_REQUEST", "Submitted CR " + saved.getChangeCode());
        return saved;
    }

    @Transactional
    public ChangeRequest updateStatus(Long id, String status, String approvedBy) {
        ChangeRequest cr = changeRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Change Request not found with id: " + id));
        cr.setStatus(status);
        cr.setApprovedBy(approvedBy);
        ChangeRequest updated = changeRequestRepository.save(cr);
        auditLogService.logAction(approvedBy, "ADMIN", "UPDATE_CHANGE_REQUEST", "Change Request " + cr.getChangeCode() + " set to " + status);
        return updated;
    }
}
