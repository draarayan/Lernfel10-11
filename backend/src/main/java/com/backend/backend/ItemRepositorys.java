package com.backend.backend;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepositorys extends JpaRepository<Item, Long> {
}
