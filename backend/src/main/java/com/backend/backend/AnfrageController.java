package com.backend.backend;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.backend.repository.AnfrageRepository;

@RestController
@RequestMapping("/api/anfragen")
@CrossOrigin(origins = "http://localhost:4200")
public class AnfrageController {

    @Autowired
    private AnfrageRepository anfrageRepository;

    @PostMapping
    public Anfrage createAnfrage(@RequestBody Anfrage anfrage) {
        return anfrageRepository.save(anfrage); // Speichert die Anfrage in der Datenbank
    }

    // Endpunkt, um alle Anfragen für den Event-Ersteller abzurufen
    @GetMapping("/by-owner/{ownerId}")
    public List<Anfrage> getAnfragenByOwnerId(@PathVariable Long ownerId) {
        return anfrageRepository.findByEventOwnerId(ownerId); // Gibt Anfragen zurück, die zu den Events des Event-Erstellers gehören
    }
}
