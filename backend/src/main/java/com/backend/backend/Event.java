package com.backend.backend;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String createdBy;
    private Long userId;

    @Column(name = "event_date")  // Neues Feld für das benutzerdefinierte Event-Datum
    private LocalDate eventDate;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<Anfrage> anfragen = new ArrayList<>();

    // Getter und Setter für eventDate
    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }


    public List<Anfrage> getAnfragen() {
        return anfragen;
    }

    public void setAnfragen(List<Anfrage> anfragen) {
        this.anfragen = anfragen;
    }
}
