package com.enterprise.portal.config;

import com.enterprise.portal.model.*;
import com.enterprise.portal.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final KbArticleRepository kbArticleRepository;
    private final AssetRepository assetRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           KbArticleRepository kbArticleRepository,
                           AssetRepository assetRepository,
                           TicketRepository ticketRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.kbArticleRepository = kbArticleRepository;
        this.assetRepository = assetRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setFullName("Enterprise Admin");
            admin.setEmail("admin@enterprise.com");
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);
            admin.setDepartment("IT Operations");
            admin.setActive(true);
            userRepository.save(admin);

            User tech = new User();
            tech.setFullName("Alex Tech");
            tech.setEmail("tech@enterprise.com");
            tech.setPasswordHash(passwordEncoder.encode("Tech@123"));
            tech.setRole(Role.TECHNICIAN);
            tech.setDepartment("IT Service Desk");
            tech.setActive(true);
            userRepository.save(tech);

            User employee = new User();
            employee.setFullName("Sarah Employee");
            employee.setEmail("employee@enterprise.com");
            employee.setPasswordHash(passwordEncoder.encode("User@123"));
            employee.setRole(Role.EMPLOYEE);
            employee.setDepartment("Finance");
            employee.setActive(true);
            userRepository.save(employee);
        }

        if (kbArticleRepository.count() == 0) {
            KbArticle kb1 = new KbArticle();
            kb1.setTitle("VPN Connection Troubleshooting Guide");
            kb1.setCategory("Network & Access");
            kb1.setAuthorName("Alex Tech");
            kb1.setContent("Step 1: Open GlobalProtect VPN client. Step 2: Ensure portal address is vpn.enterprise.com. Step 3: Clear DNS cache via ipconfig /flushdns.");
            kb1.setTags("vpn, network, remote, access");
            kb1.setViewCount(142);
            kb1.setHelpfulCount(38);
            kb1.setDeflectedCount(12);
            kbArticleRepository.save(kb1);

            KbArticle kb2 = new KbArticle();
            kb2.setTitle("Facilities: Adjusting Office Thermostat / HVAC");
            kb2.setCategory("Facilities Management");
            kb2.setAuthorName("Corporate Facilities Team");
            kb2.setContent("Zone HVAC controllers operate on 15-minute sync cycles. Set target temperature between 21°C and 24°C.");
            kb2.setTags("hvac, temperature, facilities, cooling");
            kb2.setViewCount(95);
            kb2.setHelpfulCount(24);
            kb2.setDeflectedCount(7);
            kbArticleRepository.save(kb2);
        }

        if (assetRepository.count() == 0) {
            Asset asset1 = new Asset();
            asset1.setAssetTag("AST-MAC-9082");
            asset1.setName("MacBook Pro 16\" M3 Max");
            asset1.setCategory("Laptop");
            asset1.setSerialNumber("C02G3098MD6M");
            asset1.setStatus("Active");
            asset1.setAssignedUser("Sarah Employee");
            asset1.setLocation("Floor 3 - Desk 304");
            asset1.setPurchaseDate(LocalDate.of(2025, 3, 15));
            assetRepository.save(asset1);

            Asset asset2 = new Asset();
            asset2.setAssetTag("AST-SVR-0104");
            asset2.setName("Dell PowerEdge R760 Database Server");
            asset2.setCategory("Server");
            asset2.setSerialNumber("DP-9982-X7");
            asset2.setStatus("Active");
            asset2.setAssignedUser("IT Infrastructure Team");
            asset2.setLocation("Data Center Rack B4");
            asset2.setPurchaseDate(LocalDate.of(2024, 11, 1));
            assetRepository.save(asset2);
        }
    }
}
