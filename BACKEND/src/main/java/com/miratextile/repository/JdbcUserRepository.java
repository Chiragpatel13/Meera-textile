package com.miratextile.repository;

import com.miratextile.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Repository
@RequiredArgsConstructor
public class JdbcUserRepository implements UserRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User();
        user.setUserId(rs.getLong("user_id"));
        user.setUsername(rs.getString("username"));
        user.setFullName(rs.getString("full_name"));
        user.setEmail(rs.getString("email"));
        user.setPasswordHash(rs.getString("password_hash"));
        user.setRole(rs.getString("role"));
        user.setActive(rs.getBoolean("is_active"));
        user.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        Timestamp lastLogin = rs.getTimestamp("last_login");
        user.setLastLogin(lastLogin != null ? lastLogin.toLocalDateTime() : null);
        return user;
    };

    @Override
    public Optional<User> findByUsername(String username) {
        try {
            String sql = "SELECT * FROM users WHERE username = ?";
            List<User> users = jdbcTemplate.query(sql, userRowMapper, username);
            return users.stream().findFirst();
        } catch (Exception e) {
            log.error("Error finding user by username: {}", username, e);
            throw new RuntimeException("Database error while finding user", e);
        }
    }

    @Override
    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM users WHERE user_id = ?";
        return jdbcTemplate.query(sql, userRowMapper, id)
                .stream()
                .findFirst();
    }

    @Override
    public User save(User user) {
        String sql = """
            INSERT INTO users (username, full_name, email, password_hash, role, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"user_id"});
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getFullName());
            ps.setString(3, user.getEmail());
            ps.setString(4, user.getPasswordHash());
            ps.setString(5, user.getRole());
            ps.setBoolean(6, user.isActive());
            ps.setTimestamp(7, Timestamp.valueOf(LocalDateTime.now()));
            return ps;
        }, keyHolder);

        // Get the generated user_id
        Number key = keyHolder.getKey();
        if (key == null) {
            throw new RuntimeException("Failed to retrieve generated key after user insertion");
        }
        user.setUserId(key.longValue());

        return user;
    }

    @Override
    public void update(User user) {
        String sql = "UPDATE users SET full_name = ?, email = ?, role = ?, is_active = ? WHERE user_id = ?";

        jdbcTemplate.update(sql,
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.isActive(),
                user.getUserId()
        );
    }

    @Override
    public void updateLastLogin(Long userId) {
        String sql = "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?";
        jdbcTemplate.update(sql, userId);
    }

    @Override
    public boolean existsByUsername(String username) {
        String sql = "SELECT COUNT(*) FROM users WHERE username = ?";
        int count = jdbcTemplate.queryForObject(sql, Integer.class, username);
        return count > 0;
    }

    @Override
    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        int count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count > 0;
    }

    @Override
    public List<User> findAll() {
        String sql = "SELECT * FROM users ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, userRowMapper);
    }

    @Override
    public void updateActiveStatus(Long userId, boolean active) {
        String sql = "UPDATE users SET is_active = ? WHERE user_id = ?";
        jdbcTemplate.update(sql, active, userId);
    }

    @Override
    public void updatePassword(Long userId, String newPasswordHash) {
        String sql = "UPDATE users SET password_hash = ? WHERE user_id = ?";
        jdbcTemplate.update(sql, newPasswordHash, userId);
    }
    @Override
    public void createAdminUser(String username, String fullName, String email, String passwordHash) {
        String sql = """
        INSERT INTO users (username, full_name, email, password_hash, role, is_active, created_at)
        VALUES (?, ?, ?, ?, 'STORE_MANAGER', true, CURRENT_TIMESTAMP)
        ON CONFLICT (username) DO NOTHING
    """;

        jdbcTemplate.update(sql, username, fullName, email, passwordHash);
    }
}