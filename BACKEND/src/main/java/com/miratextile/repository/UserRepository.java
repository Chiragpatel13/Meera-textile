package com.miratextile.repository;

import com.miratextile.model.User;
import java.util.List;
import java.util.Optional;

public interface UserRepository {
    Optional<User> findByUsername(String username);
    Optional<User> findById(Long id);
    User save(User user);
    void update(User user);
    void updateLastLogin(Long userId);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findAll();
    void updateActiveStatus(Long userId, boolean active);
    void updatePassword(Long userId, String newPasswordHash);
    void createAdminUser(String username, String fullName, String email, String passwordHash);
}