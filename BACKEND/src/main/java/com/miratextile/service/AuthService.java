package com.miratextile.service;

import com.miratextile.dto.LoginRequest;
import com.miratextile.dto.LoginResponse;
import com.miratextile.model.User;
import com.miratextile.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final JdbcTemplate jdbcTemplate;

    public LoginResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            User user = findUserByUsername(loginRequest.getUsername());
            if (user == null) {
                throw new BadCredentialsException("User not found");
            }

            String jwt = jwtTokenProvider.generateToken(authentication);

            return LoginResponse.builder()
                    .token(jwt)
                    .role(user.getRole())
                    .fullName(user.getFullName())
                    .build();

        } catch (DisabledException e) {
            log.error("Account is disabled for user: {}", loginRequest.getUsername());
            throw new RuntimeException("Account is disabled");
        } catch (BadCredentialsException e) {
            log.error("Invalid credentials for user: {}", loginRequest.getUsername());
            throw new RuntimeException("Invalid username or password");
        } catch (Exception e) {
            log.error("Authentication failed for user: {}", loginRequest.getUsername(), e);
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    private User findUserByUsername(String username) {
        String sql = "SELECT * FROM users WHERE username = ?";
        return jdbcTemplate.query(sql, 
            (rs, rowNum) -> User.builder()
                .userId(rs.getLong("user_id"))
                .username(rs.getString("username"))
                .fullName(rs.getString("full_name"))
                .email(rs.getString("email"))
                .passwordHash(rs.getString("password_hash"))
                .role(rs.getString("role"))
                .isActive(rs.getBoolean("is_active"))
                .createdAt(rs.getObject("created_at", LocalDateTime.class))
                .build(),
            username)
            .stream()
            .findFirst()
            .orElse(null);
    }
}