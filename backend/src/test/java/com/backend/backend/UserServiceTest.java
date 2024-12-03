package com.backend.backend;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.backend.backend.repository.UserRepository;

import java.lang.reflect.Field;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Test
    void testFindAllUsers() throws Exception {
        // Mock the repository
        UserRepository userRepository = Mockito.mock(UserRepository.class);

        // Mock behavior for the repository
        when(userRepository.findAll()).thenReturn(List.of());

        // Create an instance of NutzerService
        UserService nutzerService = new UserService();

        // Use Reflection to inject the mock repository
        Field field = UserService.class.getDeclaredField("userRepository"); // Korrekter Feldname
        field.setAccessible(true); // Make the private field accessible
        field.set(nutzerService, userRepository); // Inject the mock into the service

        // Call the method to test
        var result = nutzerService.findAll();

        // Verify the interactions
        verify(userRepository, times(1)).findAll();

        // Simple assertion
        assertNotNull(result);
    }
}