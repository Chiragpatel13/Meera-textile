package com.miratextile.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

@Slf4j
@Component
@RequiredArgsConstructor
public class SchemaInitializer {

    private final DataSource dataSource;

    public void initializeSchema() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        
        log.info("Initializing database schema...");
        
        jdbcTemplate.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id BIGSERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(100) NOT NULL,
                role VARCHAR(20) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP NOT NULL,
                last_login TIMESTAMP
            )
        """);
        
        log.info("Database schema initialized successfully");
    }
}