package com.backend.backend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class itemService {

    @Autowired
    private com.backend.backend.itemRepository itemRepository;

    public List<item> findAll() {
        return itemRepository.findAll();
    }

    public item save(item item) {
        return itemRepository.save(item);
    }

    public void deleteById(Long id) {
        itemRepository.deleteById(id);
    }
}
