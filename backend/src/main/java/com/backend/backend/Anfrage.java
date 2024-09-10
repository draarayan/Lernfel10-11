package com.backend.backend;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Anfrage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id")  // Verbindung zur Event-Tabelle
    private Event event;

    private String requestedBy;
    private String requestItem;
    private String status = "pending";
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getter und Setter
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
        this.event = event;  // Setze das Event-Objekt, um event_id zu speichern
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
