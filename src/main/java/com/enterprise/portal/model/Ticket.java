package com.enterprise.portal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_code", unique = true, nullable = false)
    private String ticketCode;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requester_id")
    private User requester;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_tech_id")
    private User assignedTech;

    @Column(name = "asset_id")
    private String assetId;

    @Column(name = "location")
    private String location;

    @Column(name = "ai_sentiment")
    private String aiSentiment;

    @Column(name = "ai_urgency_score")
    private Integer aiUrgencyScore;

    @Column(name = "ai_suggested_kb")
    private String aiSuggestedKb;

    @Column(name = "is_major_incident")
    private boolean majorIncident = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Ticket() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = TicketStatus.SUBMITTED;
        }
        if (this.priority == null) {
            this.priority = TicketPriority.P3_MEDIUM;
        }
        if (this.ticketCode == null) {
            this.ticketCode = "INC-" + System.currentTimeMillis() % 100000;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTicketCode() { return ticketCode; }
    public void setTicketCode(String ticketCode) { this.ticketCode = ticketCode; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public TicketPriority getPriority() { return priority; }
    public void setPriority(TicketPriority priority) { this.priority = priority; }

    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }

    public User getRequester() { return requester; }
    public void setRequester(User requester) { this.requester = requester; }

    public User getAssignedTech() { return assignedTech; }
    public void setAssignedTech(User assignedTech) { this.assignedTech = assignedTech; }

    public String getAssetId() { return assetId; }
    public void setAssetId(String assetId) { this.assetId = assetId; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getAiSentiment() { return aiSentiment; }
    public void setAiSentiment(String aiSentiment) { this.aiSentiment = aiSentiment; }

    public Integer getAiUrgencyScore() { return aiUrgencyScore; }
    public void setAiUrgencyScore(Integer aiUrgencyScore) { this.aiUrgencyScore = aiUrgencyScore; }

    public String getAiSuggestedKb() { return aiSuggestedKb; }
    public void setAiSuggestedKb(String aiSuggestedKb) { this.aiSuggestedKb = aiSuggestedKb; }

    public boolean isMajorIncident() { return majorIncident; }
    public void setMajorIncident(boolean majorIncident) { this.majorIncident = majorIncident; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
