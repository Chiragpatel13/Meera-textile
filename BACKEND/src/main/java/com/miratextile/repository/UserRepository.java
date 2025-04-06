package com.miratextile.repository;

import com.miratextile.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findById(Long id);
    User save(User user);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findAll();

    @Modifying
    @Query("UPDATE User u SET u.isActive = false WHERE u.userId = :userId")
    void deactivateUser(Long userId);

    @Modifying
    @Query("UPDATE User u SET u.isActive = true WHERE u.userId = :userId")
    void activateUser(Long userId);

    @Modifying
    @Query("UPDATE User u SET u.passwordHash = :passwordHash WHERE u.userId = :userId")
    void updatePassword(Long userId, String passwordHash);

    @Query(value = "INSERT INTO users (username, full_name, email, password_hash, role, is_active, created_at) " +
            "VALUES ('admin', 'System Administrator', 'admin@miratextile.com', " +
            "'$2a$10$rDmFN6ZJvwFqMz1qZ.3ZqO1qX9X9X9X9X9X9X9X9X9X9X9X9X9X', 'ADMIN', true, CURRENT_TIMESTAMP) " +
            "ON CONFLICT (username) DO NOTHING", nativeQuery = true)
    void createAdminUser();
}