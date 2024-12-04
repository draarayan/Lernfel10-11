package com.backend.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class NutzerService {

    @Autowired
    private NutzerRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Nutzer> findAll() {
        return userRepository.findAll();
    }

    public Nutzer save(Nutzer user) {
        // Passwort vor dem Speichern hashen
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public Optional<Nutzer> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<Nutzer> findByEmailAndPassword(String email, String password) {
        Optional<Nutzer> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            boolean matches = passwordEncoder.matches(password, user.get().getPassword());
            if (matches) {
                return user;
            }
            System.out.println("Passwort stimmt nicht überein");
        } else {
            System.out.println("Benutzer mit Email nicht gefunden: " + email);
        }
        return Optional.empty();
    }
    

    public boolean existsById(Long id) {
        return userRepository.existsById(id);
    }

    
    public void changePassword(String email, String currentPassword, String newPassword) {
        Nutzer user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden"));

        
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Aktuelles Passwort ist falsch");
        }

        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
