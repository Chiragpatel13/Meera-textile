package com.miratextile.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        log.info("Initializing database...");
        try {
            // Read the SQL script
            ClassPathResource resource = new ClassPathResource("db/init.sql");
            String sql = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            
            // Split the SQL script into individual statements
            String[] statements = sql.split(";");
            
            // Execute each statement
            for (String statement : statements) {
                if (statement.trim().isEmpty()) {
                    continue;
                }
                
                try {
                    log.debug("Executing SQL: {}", statement);
                    jdbcTemplate.execute(statement);
                } catch (Exception e) {
                    // Log the error but continue with other statements
                    log.warn("Error executing SQL statement: {}", e.getMessage());
                }
            }
            
            log.info("Database initialization completed successfully");
        } catch (IOException e) {
            log.error("Error reading SQL script: {}", e.getMessage());
        } catch (Exception e) {
            log.error("Error initializing database: {}", e.getMessage());
        }
    }
}