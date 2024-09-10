package com.backend.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.backend.backend.repository.AnfrageRepository;
import com.backend.backend.repository.EventRepository;

import java.util.List;
@RestController
@RequestMapping("/api/anfragen")
@CrossOrigin(origins = "http://localhost:4200")
public class AnfrageController {

    @Autowired
    private AnfrageRepository anfrageRepository;

    @Autowired
    private EventRepository eventRepository;

    @PostMapping("/{anfrageId}/confirm")
    public ResponseEntity<?> confirmAnfrage(@PathVariable Long anfrageId) {
        Anfrage anfrage = anfrageRepository.findById(anfrageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Anfrage nicht gefunden: " + anfrageId));
        anfrage.setStatus("accepted");
        anfrageRepository.save(anfrage);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/create")
    public ResponseEntity<Anfrage> createAnfrage(@RequestBody Anfrage anfrage, @RequestParam Long eventId, @RequestParam Long userId) {
        // Finde das Event anhand der eventId
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Event nicht gefunden mit ID: " + eventId));

        // Setze das Event in der Anfrage
        anfrage.setEvent(event);

        // Setze die User-ID des Benutzers, der die Anfrage erstellt
        anfrage.setRequestedByUserId(userId);

        // Speichere die Anfrage in der Datenbank
        Anfrage savedAnfrage = anfrageRepository.save(anfrage);

        return ResponseEntity.ok(savedAnfrage);
    }

    @PostMapping("/{anfrageId}/reject")
    public ResponseEntity<?> rejectAnfrage(@PathVariable Long anfrageId) {
        Anfrage anfrage = anfrageRepository.findById(anfrageId)
                .orElseThrow(() -> new IllegalArgumentException("Anfrage nicht gefunden: " + anfrageId));
        anfrage.setStatus("rejected");
        anfrageRepository.save(anfrage);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{anfrageId}")
    public ResponseEntity<?> deleteAnfrage(@PathVariable Long anfrageId, @RequestParam Long userId) {
        Anfrage anfrage = anfrageRepository.findById(anfrageId)
                .orElseThrow(() -> new IllegalArgumentException("Anfrage nicht gefunden: " + anfrageId));
    
        // Nur der Ersteller des Events darf akzeptierte Anfragen löschen
        if ("accepted".equals(anfrage.getStatus()) && !anfrage.getEvent().getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Nur der Ersteller kann akzeptierte Anfragen löschen");
        }
    
        // Anfragen können gelöscht werden, wenn sie nicht akzeptiert sind oder der Event-Ersteller die Anfrage löscht
        anfrageRepository.delete(anfrage);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-requests/{userId}")
    public List<Anfrage> getMyRequests(@PathVariable Long userId) {
        return anfrageRepository.findByRequestedByUserId(userId);
    }

    @GetMapping("/by-owner/{ownerId}/active")
    public List<Anfrage> getActiveAnfragenByOwnerId(@PathVariable Long ownerId) {
        System.out.println("Loading active requests for owner: " + ownerId);
        return anfrageRepository.findActiveAnfragenByOwnerId(ownerId);
    }
    
    @GetMapping("/by-user/{userId}/accepted")
    public List<Anfrage> getAcceptedAnfragenByUserId(@PathVariable Long userId) {
        return anfrageRepository.findAcceptedAnfragenByUserId(userId);
    }

    @GetMapping("/by-user/{userId}/rejected")
    public List<Anfrage> getRejectedAnfragenByUserId(@PathVariable Long userId) {
        return anfrageRepository.findRejectedAnfragenByUserId(userId);
    }
}
