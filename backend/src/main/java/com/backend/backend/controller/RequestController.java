package com.backend.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.backend.backend.repository.RequestRepository;
import com.backend.backend.model.Event;
import com.backend.backend.model.Request;
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
    public ResponseEntity<?> confirmRequest(@PathVariable Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Anfrage nicht gefunden: " + requestId));
        request.setStatus("accepted");
        requestRepository.save(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/create")
    public ResponseEntity<Request> createRequest(@RequestBody Request request, @RequestParam Long eventId, @RequestParam Long userId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Event nicht gefunden mit ID: " + eventId));

        request.setEvent(event);
        request.setRequestedByUserId(userId);
        Request savedRequest = requestRepository.save(request);

        return ResponseEntity.ok(savedRequest);
    }

    @PostMapping("/{anfrageId}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Anfrage nicht gefunden: " + requestId));
        request.setStatus("rejected");
        requestRepository.save(request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{anfrageId}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long requestId, @RequestParam Long userId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Anfrage nicht gefunden: " + requestId));
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
    public List<Request> getActiveRequestsByOwnerId(@PathVariable Long ownerId) {
        System.out.println("Loading active requests for owner: " + ownerId);
        return requestRepository.findActiveRequestsByOwnerId(ownerId);
    }
    
    @GetMapping("/by-user/{userId}/accepted")
    public List<Request> getAcceptedRequestsByUserId(@PathVariable Long userId) {
        return requestRepository.findAcceptedRequestsByUserId(userId);
    }

    @GetMapping("/by-user/{userId}/rejected")
    public List<Request> getRejectedRequestsByUserId(@PathVariable Long userId) {
        return requestRepository.findRejectedRequestsByUserId(userId);
    }
}
