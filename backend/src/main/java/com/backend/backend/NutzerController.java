package com.backend.backend;

import java.util.Map;  // Richtiger Import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200") // Frontend URL
public class NutzerController {

    @Autowired
    private final NutzerService userService;

    public NutzerController(NutzerService userService) {
        this.userService = userService;
    }

    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @GetMapping
    public ResponseEntity<List<Nutzer>> getAllUsers() {
        List<Nutzer> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Benutzer nicht authentifiziert");
        }
    
        String username = principal.getName();
        Optional<Nutzer> user = userService.findByEmail(username);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Benutzer nicht gefunden");
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Nutzer user) {
        if (user.getEmail() == null || user.getPassword() == null || user.getName() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Fehlende erforderliche Felder");
        }
    
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ein Benutzer mit dieser E-Mail-Adresse existiert bereits");
        }
    
        try {
            userService.save(user);
            return ResponseEntity.ok("Benutzer erfolgreich registriert");
        } catch (Exception e) {
            e.printStackTrace(); // Ausgabe des Stacktraces zur Fehlersuche
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Fehler beim Anlegen des Benutzers: " + e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Nutzer user) {
        Optional<Nutzer> existingUser = userService.findByEmailAndPassword(user.getEmail(), user.getPassword());
        if (existingUser.isPresent()) {
            String token = jwtTokenProvider.createToken(user.getEmail());  // JWT Token generieren
            return ResponseEntity.ok(Map.of("token", token));  // Token in der Antwort senden
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ungültige Anmeldedaten");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            if (userService.existsById(id)) {
                userService.deleteById(id);
                return ResponseEntity.ok("Benutzer erfolgreich gelöscht");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body("Benutzer nicht gefunden");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Fehler beim Löschen des Benutzers: " + e.getMessage());
        }
    }
}
