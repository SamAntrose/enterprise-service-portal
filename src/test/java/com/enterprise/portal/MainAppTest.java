package com.enterprise.portal;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class MainAppTest {

    @Test
    @DisplayName("Application Context Loads Successfully")
    public void contextLoads() {
        // Verifies that the Spring Boot application context starts without errors
        assertTrue(true, "Application context loaded successfully");
    }
}
