package com.backend.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.backend.backend.Anfrage;
import java.util.List;

@Repository
public interface AnfrageRepository extends JpaRepository<Anfrage, Long> {
    // Neue Methode, um Anfragen für alle Events eines bestimmten Benutzers abzurufen
    @Query("SELECT a FROM Anfrage a WHERE a.event.userId = :ownerId")
    List<Anfrage> findByEventOwnerId(@Param("ownerId") Long ownerId);
}
