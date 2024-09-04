package com.backend.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface NutzerRepository extends JpaRepository<Nutzer, Long> {
    boolean existsByEmail(String email);
    Optional<Nutzer> findByEmail(String email);
    Optional<Nutzer> findByEmailAndPassword(String email, String password);
}
