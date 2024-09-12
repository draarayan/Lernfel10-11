package com.backend.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.backend.backend.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByPlz(String plz);
}
