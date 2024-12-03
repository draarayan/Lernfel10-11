package com.backend.backend.controller;

import java.util.Map;  
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.backend.model.Event;
import com.backend.backend.model.User;
import com.backend.backend.repository.EventRepository;
import com.backend.backend.service.UserService;
import com.backend.backend.token.JwtTokenProvider;

import jakarta.servlet.http.HttpServletRequest;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200") 
public class UserController {

    @Autowired
    private final UserService userService;

    @Autowired
    private EventRepository eventRepository;

    @GetMapping("/events/filter/{plz}")
    public List<Event> getEventsByPlz(@PathVariable String plz) {
    return eventRepository.findByPlz(plz);
    }

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAll();
        return ResponseEntity.ok(users);
    }
    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Benutzer nicht authentifiziert");
        }
    
        String username = principal.getName();
        Optional<User> user = userService.findByEmail(username);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Benutzer nicht gefunden");
        }
    }
    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        if (user.getEmail() == null || user.getPassword() == null || user.getName() == null || user.getNachname() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Fehlende erforderliche Felder");
        }
    
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ein Benutzer mit dieser E-Mail-Adresse existiert bereits");
        }
    
        try {
            userService.save(user);
            return ResponseEntity.ok("Benutzer erfolgreich registriert");
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Fehler beim Anlegen des Benutzers: " + e.getMessage());
        }
    }
    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        Optional<User> existingUser = userService.findByEmailAndPassword(user.getEmail(), user.getPassword());
        if (existingUser.isPresent()) {
            String token = jwtTokenProvider.createToken(user.getEmail());  
            return ResponseEntity.ok(Map.of("token", token));  
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ungültige Anmeldedaten");
        }
    }
    @CrossOrigin(origins = "http://localhost:4200")
@DeleteMapping("/{id}")
public ResponseEntity<String> deleteUser(@PathVariable Long id) {
    try {
        if (userService.existsById(id)) {
            System.out.println("ID existiert: " + id);
            userService.deleteById(id);
            return ResponseEntity.ok("Benutzer erfolgreich gelöscht");
        } else {
            System.out.println("ID existiert nicht: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body("Benutzer nicht gefunden");
        }
    } catch (Exception e) {
        e.printStackTrace(); 
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Fehler beim Löschen des Benutzers: " + e.getMessage());
    }
}
@CrossOrigin(origins = "http://localhost:4200")
@PutMapping("/change-password")
public ResponseEntity<String> changePassword(HttpServletRequest request, @RequestBody Map<String, String> passwords) {
    Principal principal = request.getUserPrincipal();
    if (principal == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Benutzer nicht authentifiziert");
    }

    String email = principal.getName();
    String currentPassword = passwords.get("currentPassword");
    String newPassword = passwords.get("newPassword");

    if (currentPassword == null || newPassword == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Fehlende Passwortinformationen");
    }

    try {
        
        userService.changePassword(email, currentPassword, newPassword);
        return ResponseEntity.ok("Passwort erfolgreich geändert");
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Fehler beim Ändern des Passworts: " + e.getMessage());
    }
}
}

