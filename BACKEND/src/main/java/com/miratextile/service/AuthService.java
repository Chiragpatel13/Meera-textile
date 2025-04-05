package com.miratextile.service;

import com.miratextile.dto.LoginRequest;
import com.miratextile.dto.LoginResponse;
import com.miratextile.exception.AuthenticationException;
import com.miratextile.model.User;
import com.miratextile.repository.UserRepository;
import com.miratextile.security.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public LoginResponse login(LoginRequest loginRequest) {
        log.debug("Attempting login for user: {}", loginRequest.getUsername());

        try {
            // Check if user exists
            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            log.debug("User found: {}", user.getUsername());

            // Check if user is active
            if (!user.isActive()) {
                log.debug("User account is disabled: {}", user.getUsername());
                throw new DisabledException("User account is disabled");
            }

            // Attempt authentication
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            log.debug("Authentication successful for user: {}", user.getUsername());

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            // Update last login
            userRepository.updateLastLogin(user.getUserId());

            return LoginResponse.builder()
                    .token(jwt)
                    .role(user.getRole())
                    .fullName(user.getFullName())
                    .build();

        } catch (DisabledException e) {
            log.error("Account is disabled for user: {}", loginRequest.getUsername());
            throw new AuthenticationException("Account is disabled");
        } catch (BadCredentialsException e) {
            log.error("Invalid credentials for user: {}", loginRequest.getUsername());
            throw new AuthenticationException("Invalid username or password");
        } catch (Exception e) {
            log.error("Authentication failed for user: {}", loginRequest.getUsername(), e);
            throw new AuthenticationException("Authentication failed: " + e.getMessage());
        }
    }
}