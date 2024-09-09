package com.backend.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.backend.backend.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
}
