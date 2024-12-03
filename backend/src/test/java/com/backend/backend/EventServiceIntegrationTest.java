package com.backend.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;

import com.backend.backend.repository.EventRepository;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest // Für einen vollständigen Spring-Kontext
public class EventServiceIntegrationTest {

    @Autowired
    private EventRepository eventRepository;

    @Test
    public void testAddEvent() {
        // Arrange: Erstelle ein neues Event.
        Event event = new Event();
        event.setTitle("Test Event");
        event.setDescription("This is a test event");
        event.setPlz("12345");

        // Act: Speichere das Event in der Datenbank
        Event savedEvent = eventRepository.save(event);

        // Assert: Überprüfe, ob das Event korrekt gespeichert wurde
        assertThat(savedEvent).isNotNull();
        assertThat(savedEvent.getId()).isNotNull();
        assertThat(savedEvent.getTitle()).isEqualTo("Test Event");

        // Optional: Überprüfe, ob es in der Datenbank existiert
        assertThat(eventRepository.findById(savedEvent.getId())).isPresent();
    }
}