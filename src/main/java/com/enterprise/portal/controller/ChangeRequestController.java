package com.enterprise.portal.controller;

import com.enterprise.portal.dto.ApiResponse;
import com.enterprise.portal.model.ChangeRequest;
import com.enterprise.portal.service.ChangeRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/changes")
@CrossOrigin(origins = "*")
public class ChangeRequestController {

    private final ChangeRequestService changeRequestService;

    public ChangeRequestController(ChangeRequestService changeRequestService) {
        this.changeRequestService = changeRequestService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ChangeRequest>>> getAllChangeRequests() {
        return ResponseEntity.ok(ApiResponse.success(changeRequestService.getAllChangeRequests()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ChangeRequest>> createChangeRequest(@RequestBody ChangeRequest request,
                                                                           @RequestHeader(value = "X-User-Email", defaultValue = "admin@enterprise.com") String userEmail) {
        return ResponseEntity.ok(ApiResponse.success("Change Request submitted", changeRequestService.createChangeRequest(request, userEmail)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ChangeRequest>> updateStatus(@PathVariable Long id,
                                                                    @RequestBody Map<String, String> body,
                                                                    @RequestHeader(value = "X-User-Email", defaultValue = "cab@enterprise.com") String userEmail) {
        String status = body.get("status");
        return ResponseEntity.ok(ApiResponse.success("Change Request status updated", changeRequestService.updateStatus(id, status, userEmail)));
    }
}
