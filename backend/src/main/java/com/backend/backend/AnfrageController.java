package com.backend.backend;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.backend.repository.EventRepository; 
import com.backend.backend.repository.AnfrageRepository;

@RestController
@RequestMapping("/api/anfragen")
@CrossOrigin(origins = "http://localhost:4200")
public class AnfrageController {

    @Autowired
    private AnfrageRepository anfrageRepository;

    @Autowired
    private EventRepository eventRepository;

    // Bestätige eine Anfrage
    @PostMapping("/{anfrageId}/confirm")
    public ResponseEntity<?> confirmAnfrage(@PathVariable Long anfrageId) {
        Anfrage anfrage = anfrageRepository.findById(anfrageId)
            .orElseThrow(() -> new IllegalArgumentException("Anfrage nicht gefunden: " + anfrageId));
        anfrage.setStatus("accepted");
        anfrageRepository.save(anfrage);
        return ResponseEntity.ok().build();
    }

    // Lehne eine Anfrage ab
    @PostMapping("/{anfrageId}/reject")
    public ResponseEntity<?> rejectAnfrage(@PathVariable Long anfrageId) {
        Anfrage anfrage = anfrageRepository.findById(anfrageId)
            .orElseThrow(() -> new IllegalArgumentException("Anfrage nicht gefunden: " + anfrageId));
        anfrage.setStatus("rejected");
        anfrageRepository.save(anfrage);
        return ResponseEntity.ok().build();
    }

    // Erstelle eine neue Anfrage
    @PostMapping
    public Anfrage createAnfrage(@RequestBody Anfrage anfrage) {
        // Logge die empfangene Event-ID
        Long eventId = anfrage.getEvent().getId();
        System.out.println("Empfangene eventId im Backend: " + eventId);
    
        // Suche das Event anhand der eventId
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Event nicht gefunden mit ID: " + eventId));
    
        // Setze das Event in der Anfrage
        anfrage.setEvent(event);
    
        // Anfrage speichern
        return anfrageRepository.save(anfrage);
    }
    
    // Endpunkt, um alle Anfragen für den Event-Ersteller abzurufen
    @GetMapping("/by-owner/{ownerId}")
    public List<Anfrage> getAnfragenByOwnerId(@PathVariable Long ownerId) {
        return anfrageRepository.findByEventOwnerId(ownerId); // Gibt Anfragen zurück, die zu den Events des Event-Erstellers gehören
    }
}
