package com.backend.backend;

import com.backend.backend.item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface itemRepository extends JpaRepository<item, Long> {
}
