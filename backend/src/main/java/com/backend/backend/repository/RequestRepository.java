package com.backend.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.backend.backend.Request;
import java.util.List;
@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {

    // Finde Anfragen basierend auf der Event ID
    List<Request> findByEventId(Long eventId);

    // Finde Anfragen basierend auf dem Benutzer, der die Anfrage gestellt hat
    List<Request> findByRequestedBy(String requestedBy);

    // Lösche alle Anfragen, die zu einem bestimmten Event gehören
    void deleteByEventId(Long eventId);

    // Finde alle abgelehnten Anfragen eines Benutzers
    @Query("SELECT a FROM Anfrage a WHERE a.requestedByUserId = :userId AND a.status = 'rejected'")
    List<Request> findRejectedRequestsByUserId(@Param("userId") Long userId);

    // Finde alle angenommenen Anfragen eines Benutzers
    @Query("SELECT a FROM Anfrage a WHERE a.requestedByUserId = :userId AND a.status = 'accepted'")
    List<Request> findAcceptedRequestsByUserId(@Param("userId") Long userId);
    // Finde alle abgelehnten Anfragen anhand des Owners
    @Query("SELECT a FROM Anfrage a WHERE a.event.userId = :ownerId AND a.status != 'rejected'")
    List<Request> findActiveRequestsByOwnerId(@Param("ownerId") Long ownerId);
    //Finde alle Anfragen eines Users
    @Query("SELECT a FROM Anfrage a WHERE a.requestedByUserId = :userId")
    List<Request> findByRequestedByUserId(@Param("userId") Long userId);
}
