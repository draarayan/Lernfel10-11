package com.backend.backend;




import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.backend.repository.EventRepository;
@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:4200")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(event -> {
                    eventRepository.delete(event);
                    return ResponseEntity.ok("Event gelöscht");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event nicht gefunden"));
    }
    
}

