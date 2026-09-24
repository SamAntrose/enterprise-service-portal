package com.enterprise.portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Enterprise Service Portal - Spring Boot Application Main Class
 * Supports PostgreSQL & H2 profiles, Spring Data JPA, JWT Security, and REST APIs.
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class EnterprisePortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(EnterprisePortalApplication.class, args);
        System.out.println("==========================================================");
        System.out.println("🚀 ENTERPRISE SERVICE PORTAL BACKEND STARTED SUCCESSFULLY!");
        System.out.println("   Web Portal URL : http://localhost:8081");
        System.out.println("   H2 DB Console  : http://localhost:8081/h2-console");
        System.out.println("==========================================================");
    }
}
