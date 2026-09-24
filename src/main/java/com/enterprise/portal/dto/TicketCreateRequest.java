package com.enterprise.portal.dto;

import jakarta.annotation.Priority;
import jakarta.validation.constraints.NotBlank;

public class TicketCreateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    private String priority;
    private String assetId;
    private String location;

    public TicketCreateRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority != null ? priority.toString() : null; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getAssetId() { return assetId; }
    public void setAssetId(String assetId) { this.assetId = assetId; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
