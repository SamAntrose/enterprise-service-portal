package com.enterprise.portal.service;

import com.enterprise.portal.dto.TicketCreateRequest;
import com.enterprise.portal.model.*;
import com.enterprise.portal.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketCommentRepository commentRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final CsatRepository csatRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public TicketService(TicketRepository ticketRepository,
                         TicketCommentRepository commentRepository,
                         ChatMessageRepository chatMessageRepository,
                         CsatRepository csatRepository,
                         UserRepository userRepository,
                         AuditLogService auditLogService) {
        this.ticketRepository = ticketRepository;
        this.commentRepository = commentRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.csatRepository = csatRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc();
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + id));
    }

    public Ticket getTicketByCode(String code) {
        return ticketRepository.findByTicketCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with code: " + code));
    }

    @Transactional
    public Ticket createTicket(TicketCreateRequest request, String userEmail) {
        User requester = userRepository.findByEmail(userEmail).orElse(null);

        TicketPriority priority = TicketPriority.fromString(request.getPriority());

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(priority);
        ticket.setStatus(TicketStatus.SUBMITTED);
        ticket.setRequester(requester);
        ticket.setAssetId(request.getAssetId());
        ticket.setLocation(request.getLocation());
        ticket.setMajorIncident(priority == TicketPriority.P1_CRITICAL);

        Ticket savedTicket = ticketRepository.save(ticket);

        auditLogService.logAction(userEmail, requester != null ? requester.getRole().name() : "EMPLOYEE",
                "CREATE_TICKET", "Created ticket " + savedTicket.getTicketCode() + " [" + savedTicket.getPriority() + "]");

        return savedTicket;
    }

    @Transactional
    public Ticket updateTicketStatus(Long ticketId, String newStatusStr, String userEmail) {
        Ticket ticket = getTicketById(ticketId);
        TicketStatus newStatus = TicketStatus.fromString(newStatusStr);
        ticket.setStatus(newStatus);
        Ticket updated = ticketRepository.save(ticket);

        auditLogService.logAction(userEmail, "TECHNICIAN", "UPDATE_TICKET_STATUS",
                "Updated ticket " + ticket.getTicketCode() + " status to " + newStatus);

        return updated;
    }

    @Transactional
    public TicketComment addComment(Long ticketId, String commentText, String authorName, boolean isInternal) {
        Ticket ticket = getTicketById(ticketId);
        TicketComment comment = new TicketComment();
        comment.setTicket(ticket);
        comment.setAuthorName(authorName);
        comment.setCommentText(commentText);
        comment.setInternal(isInternal);
        return commentRepository.save(comment);
    }

    public List<TicketComment> getTicketComments(Long ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    public List<ChatMessage> getTicketChatMessages(Long ticketId) {
        return chatMessageRepository.findByTicketIdOrderByTimestampAsc(ticketId);
    }

    @Transactional
    public ChatMessage sendChatMessage(Long ticketId, String senderName, String senderRole, String messageText) {
        ChatMessage chat = new ChatMessage();
        chat.setTicketId(ticketId);
        chat.setSenderName(senderName);
        chat.setSenderRole(senderRole);
        chat.setMessage(messageText);
        return chatMessageRepository.save(chat);
    }

    @Transactional
    public CsatRating submitCsat(Long ticketId, int rating, String feedback, String userEmail) {
        Ticket ticket = getTicketById(ticketId);
        CsatRating csat = new CsatRating();
        csat.setTicketId(ticketId);
        csat.setTicketCode(ticket.getTicketCode());
        csat.setRating(rating);
        csat.setFeedback(feedback);
        csat.setSubmittedBy(userEmail);
        return csatRepository.save(csat);
    }
}
