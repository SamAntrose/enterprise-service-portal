package com.enterprise.portal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "kb_articles")
public class KbArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private String category;

    @Column(name = "author_name")
    private String authorName;

    @Column
    private String tags;

    @Column(name = "view_count")
    private int viewCount = 0;

    @Column(name = "helpful_count")
    private int helpfulCount = 0;

    @Column(name = "deflected_count")
    private int deflectedCount = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public KbArticle() {}

    public KbArticle(Long id, String title, String content, String category, String authorName, String tags, int viewCount, int helpfulCount, int deflectedCount, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.category = category;
        this.authorName = authorName;
        this.tags = tags;
        this.viewCount = viewCount;
        this.helpfulCount = helpfulCount;
        this.deflectedCount = deflectedCount;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public int getViewCount() { return viewCount; }
    public void setViewCount(int viewCount) { this.viewCount = viewCount; }

    public int getHelpfulCount() { return helpfulCount; }
    public void setHelpfulCount(int helpfulCount) { this.helpfulCount = helpfulCount; }

    public int getDeflectedCount() { return deflectedCount; }
    public void setDeflectedCount(int deflectedCount) { this.deflectedCount = deflectedCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
