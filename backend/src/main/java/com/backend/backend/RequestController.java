package com.backend.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.backend.backend.repository.RequestRepository;
import com.backend.backend.repository.EventRepository;

import java.util.List;
@RestController
@RequestMapping("/api/anfragen")
@CrossOrigin(origins = "http://localhost:4200")
public class RequestController {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private EventRepository eventRepository;

    @PostMapping("/{anfrageId}/confirm")
    public ResponseEntity<?> confirmAnfrage(@PathVariable Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Anfrage nicht gefunden: " + requestId));
        request.setStatus("accepted");
        requestRepository.save(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/create")
    public ResponseEntity<Request> createAnfrage(@RequestBody Request request, @RequestParam Long eventId, @RequestParam Long userId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Event nicht gefunden mit ID: " + eventId));

        request.setEvent(event);
        request.setRequestedByUserId(userId);
        Request savedRequest = requestRepository.save(request);

        return ResponseEntity.ok(savedRequest);
    }

    @PostMapping("/{anfrageId}/reject")
    public ResponseEntity<?> rejectAnfrage(@PathVariable Long anfrageId) {
        Request request = requestRepository.findById(anfrageId)
                .orElseThrow(() -> new IllegalArgumentException("Anfrage nicht gefunden: " + anfrageId));
        request.setStatus("rejected");
        requestRepository.save(request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{anfrageId}")
    public ResponseEntity<?> deleteAnfrage(@PathVariable Long anfrageId, @RequestParam Long userId) {
        Request request = requestRepository.findById(anfrageId)
                .orElseThrow(() -> new IllegalArgumentException("Anfrage nicht gefunden: " + anfrageId));
        if ("accepted".equals(request.getStatus()) && !request.getEvent().getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Nur der Ersteller kann akzeptierte Anfragen löschen");
        }// noch nicht im Frontend implementiert
        requestRepository.delete(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-requests/{userId}")
    public List<Request> getMyRequests(@PathVariable Long userId) {
        return requestRepository.findByRequestedByUserId(userId);
    }

    @GetMapping("/by-owner/{ownerId}/active")
    public List<Request> getActiveAnfragenByOwnerId(@PathVariable Long ownerId) {
        System.out.println("Loading active requests for owner: " + ownerId);
        return requestRepository.findActiveAnfragenByOwnerId(ownerId);
    }
    
    @GetMapping("/by-user/{userId}/accepted")
    public List<Request> getAcceptedAnfragenByUserId(@PathVariable Long userId) {
        return requestRepository.findAcceptedAnfragenByUserId(userId);
    }

    @GetMapping("/by-user/{userId}/rejected")
    public List<Request> getRejectedAnfragenByUserId(@PathVariable Long userId) {
        return requestRepository.findRejectedAnfragenByUserId(userId);
    }
}
