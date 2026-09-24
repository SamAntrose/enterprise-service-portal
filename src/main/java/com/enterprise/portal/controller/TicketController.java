package com.enterprise.portal.controller;

import com.enterprise.portal.dto.ApiResponse;
import com.enterprise.portal.dto.TicketCreateRequest;
import com.enterprise.portal.model.*;
import com.enterprise.portal.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Ticket>>> getAllTickets() {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getAllTickets()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Ticket>> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getTicketById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Ticket>> createTicket(@Valid @RequestBody TicketCreateRequest request,
                                                             @RequestHeader(value = "X-User-Email", defaultValue = "employee@enterprise.com") String userEmail) {
        Ticket ticket = ticketService.createTicket(request, userEmail);
        return ResponseEntity.ok(ApiResponse.success("Ticket created successfully", ticket));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Ticket>> updateTicketStatus(@PathVariable Long id,
                                                                   @RequestBody Map<String, String> body,
                                                                   @RequestHeader(value = "X-User-Email", defaultValue = "tech@enterprise.com") String userEmail) {
        String status = body.get("status");
        Ticket ticket = ticketService.updateTicketStatus(id, status, userEmail);
        return ResponseEntity.ok(ApiResponse.success("Ticket status updated", ticket));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<List<TicketComment>>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getTicketComments(id)));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<TicketComment>> addComment(@PathVariable Long id,
                                                                 @RequestBody Map<String, Object> body) {
        String text = (String) body.get("commentText");
        String author = (String) body.getOrDefault("authorName", "User");
        boolean internal = Boolean.TRUE.equals(body.get("internal"));
        TicketComment comment = ticketService.addComment(id, text, author, internal);
        return ResponseEntity.ok(ApiResponse.success("Comment added", comment));
    }

    @GetMapping("/{id}/chat")
    public ResponseEntity<ApiResponse<List<ChatMessage>>> getChatMessages(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getTicketChatMessages(id)));
    }

    @PostMapping("/{id}/chat")
    public ResponseEntity<ApiResponse<ChatMessage>> sendChatMessage(@PathVariable Long id,
                                                                    @RequestBody Map<String, String> body) {
        String senderName = body.getOrDefault("senderName", "User");
        String senderRole = body.getOrDefault("senderRole", "EMPLOYEE");
        String message = body.get("message");
        ChatMessage chat = ticketService.sendChatMessage(id, senderName, senderRole, message);
        return ResponseEntity.ok(ApiResponse.success(chat));
    }

    @PostMapping("/{id}/csat")
    public ResponseEntity<ApiResponse<CsatRating>> submitCsat(@PathVariable Long id,
                                                              @RequestBody Map<String, Object> body,
                                                              @RequestHeader(value = "X-User-Email", defaultValue = "employee@enterprise.com") String userEmail) {
        int rating = (Integer) body.get("rating");
        String feedback = (String) body.get("feedback");
        CsatRating csat = ticketService.submitCsat(id, rating, feedback, userEmail);
        return ResponseEntity.ok(ApiResponse.success("CSAT rating submitted", csat));
    }
}
