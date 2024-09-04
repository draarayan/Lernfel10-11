package com.backend.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class NutzerService {

    @Autowired
    private NutzerRepository userRepository;

    public List<Nutzer> findAll() {
        return userRepository.findAll();
    }

    public Nutzer save(Nutzer user) {
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
        return userRepository.findByEmailAndPassword(email, password);
    }

    public boolean existsById(Long id) {
        return userRepository.existsById(id);
    }
}
