package com.backend.backend;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonBackReference 
    private Event event;

    private Long requestedByUserId;
    private String requestedBy;
    private String requestItem;
    private String status = "pending"; 
    private LocalDateTime createdAt = LocalDateTime.now();

        public Long getRequestedByUserId() {
        return requestedByUserId;
    }

    public void setRequestedByUserId(Long requestedByUserId) {
        this.requestedByUserId = requestedByUserId;
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public String getRequestedBy() {
        return requestedBy;
    }

    public void setRequestedBy(String requestedBy) {
        this.requestedBy = requestedBy;
    }

    public String getRequestItem() {
        return requestItem;
    }

    public void setRequestItem(String requestItem) {
        this.requestItem = requestItem;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
