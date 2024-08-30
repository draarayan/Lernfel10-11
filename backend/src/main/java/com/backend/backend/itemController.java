package com.backend.backend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.backend.backend.item;


import java.util.List;

@RestController
@RequestMapping("/api/items")
public class itemController {

    @Autowired
    private itemService itemService;

    @GetMapping
    public List<item> getAllItems() {
        return itemService.findAll();
    }

    @PostMapping
    public item createItem(@RequestBody item item) {
        return itemService.save(item);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        itemService.deleteById(id);
    }
}
