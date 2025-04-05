package com.miratextile;

import com.miratextile.config.SchemaInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class ClothingManagementSystemApplication {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(ClothingManagementSystemApplication.class, args);

        // Initialize schema
        SchemaInitializer schemaInitializer = context.getBean(SchemaInitializer.class);
        schemaInitializer.initializeSchema();
    }
}
