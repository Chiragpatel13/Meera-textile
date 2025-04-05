package com.miratextile.config;

import com.miratextile.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeAdminUser();
    }

    private void initializeAdminUser() {
        String adminUsername = "admin";
        
        if (!userRepository.existsByUsername(adminUsername)) {
            log.info("Initializing admin user...");
            
            String encodedPassword = passwordEncoder.encode("admin123");
            
            userRepository.createAdminUser(
                adminUsername,
                "System Administrator",
                "admin@miratextile.com",
                encodedPassword
            );
            
            log.info("Admin user created successfully");
        } else {
            log.info("Admin user already exists");
        }
    }
}