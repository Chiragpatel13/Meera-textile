
**Project Structure for Spring Boot Backend**
```
src/main/java
├── com.miratextile.cmd
│   ├── config              // Configuration classes
│   │   ├── SecurityConfig.java          // Spring Security configuration
│   │   ├── WebMvcConfig.java            // CORS, interceptors
│   │   ├── DatabaseConfig.java          // DataSource, JPA config
│   │   └── JwtConfig.java               // JWT properties
│   │
│   ├── controller          // REST API Controllers
│   │   ├── auth
│   │   │   └── AuthController.java      // Login, refresh, logout
│   │   ├── user
│   │   │   └── UserController.java      // User management (STORE_MANAGER only)
│   │   ├── inventory
│   │   │   ├── SKUController.java       // SKU management
│   │   │   └── InventoryController.java // Stock adjustments, alerts
│   │   ├── order
│   │   │   ├── OrderController.java     // Order processing
│   │   │   └── PaymentController.java   // Cash/QR payments, refunds
│   │   ├── customer
│   │   │   ├── CustomerController.java  // CRM operations
│   │   │   └── CreditController.java    // Credit period management
│   │   └── returns
│   │       └── ReturnController.java     // Returns processing
│   │
│   ├── service             // Business logic layer
│   │   ├── auth
│   │   │   └── AuthService.java         // Authentication logic
│   │   ├── user
│   │   │   └── UserService.java         // User CRUD operations
│   │   ├── inventory
│   │   │   ├── SKUService.java          // SKU validation, creation
│   │   │   └── InventoryService.java    // Stock updates, low-stock alerts
│   │   ├── order
│   │   │   ├── OrderService.java        // Order pricing, discounts
│   │   │   └── PaymentService.java      // Payment processing
│   │   ├── customer
│   │   │   ├── CustomerService.java     // CRM operations
│   │   │   └── CreditService.java       // Credit period tracking
│   │   └── returns
│   │       └── ReturnService.java       // Returns validation, refunds
│   │
│   ├── repository          // Data access layer (JPA Repositories)
│   │   ├── UserRepository.java
│   │   ├── SKURepository.java
│   │   ├── InventoryRepository.java
│   │   ├── OrderRepository.java
│   │   └── ...             // Other entity repositories
│   │
│   ├── model               // JPA Entities and DTOs
│   │   ├── entity
│   │   │   ├── User.java                // Maps to `users` table
│   │   │   ├── SKU.java                 // Maps to `skus` table
│   │   │   ├── Inventory.java           // Maps to `inventory` table
│   │   │   └── ...                      // Other entities
│   │   └── dto
│   │       ├── auth
│   │       │   ├── LoginRequest.java    // {username, password}
│   │       │   └── JwtResponse.java     // {access_token, refresh_token}
│   │       ├── user
│   │       │   └── UserCreateRequest.java // User creation DTO
│   │       └── ...                      // Other request/response DTOs
│   │
│   ├── security            // Security components
│   │   ├── jwt
│   │   │   ├── JwtUtil.java             // Token generation/validation
│   │   │   ├── JwtAuthenticationFilter.java // Intercepts requests
│   │   │   └── JwtAuthEntryPoint.java   // Handles unauthorized requests
│   │   └── user
│   │       └── UserDetailsServiceImpl.java // Loads user from DB
│   │
│   ├── exception           // Custom exception handling
│   │   ├── GlobalExceptionHandler.java // @ControllerAdvice class
│   │   ├── ResourceNotFoundException.java
│   │   └── AccessDeniedException.java
│   │
│   └── util                // Utilities
│       ├── AuditLogger.java            // Logs security-critical actions
│       ├── ReportGenerator.java        // PDF/CSV report generation
│       └── PaymentGatewayClient.java   // QR code integration (UPI/PayPal)
│
├── resources
│   ├── application.properties          // Common config
│   ├── application-dev.properties      // Dev environment (local DB)
│   ├── application-prod.properties     // Prod config (HTTPS, cloud DB)
│   ├── data
│   │   └── import.sql                  // Initial test data
│   └── static                          // OpenAPI/Swagger docs
│
src/test/java                         // Unit and integration tests
├── com.miratextile.cmd
│   ├── service
│   │   └── AuthServiceTest.java       // Tests for auth logic
│   ├── controller
│   │   └── OrderControllerTest.java   // MockMvc tests
│   └── security
│       └── JwtUtilTest.java           // Token validation tests
│
pom.xml (or build.gradle)             // Maven/Gradle dependencies
```

```java
package com.miratextile.auth.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security Configuration for Mira Textile Authentication System
 * Implements robust security measures as per PCI-DSS and application requirements
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF for stateless JWT-based authentication
            .csrf(csrf -> csrf.disable())
            
            // Configure session management to be stateless
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // Define authorization rules
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                
                // Role-based access control
                .requestMatchers("/api/inventory/**").hasAnyRole("INVENTORY_STAFF", "STORE_MANAGER")
                .requestMatchers("/api/sales/**").hasAnyRole("SALES_STAFF", "STORE_MANAGER")
                .requestMatchers("/api/management/**").hasRole("STORE_MANAGER")
                
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            
            // Add JWT token filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Use BCrypt with high work factor for password hashing
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(
        AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}

/**
 * JWT Authentication Filter for token-based authentication
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
        HttpServletRequest request, 
        HttpServletResponse response, 
        FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String jwt = extractJwtFromRequest(request);
            
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromJwt(jwt);
                
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, 
                        null, 
                        userDetails.getAuthorities()
                    );
                
                authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            
            filterChain.doFilter(request, response);
        } catch (Exception ex) {
            handleAuthenticationException(response, ex);
        }
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private void handleAuthenticationException(
        HttpServletResponse response, 
        Exception ex
    ) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write(
            JsonUtil.toJson(
                new ErrorResponse("Authentication failed", ex.getMessage())
            )
        );
    }
}

/**
 * JWT Token Provider for generating and validating tokens
 */
@Component
public class JwtTokenProvider {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private int jwtExpirationInMs;

    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
            .setSubject(userPrincipal.getUsername())
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(
                Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)),
                SignatureAlgorithm.HS512
            )
            .claim("roles", userPrincipal.getAuthorities())
            .compact();
    }

    public String getUsernameFromJwt(String token) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(
                Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8))
            )
            .build()
            .parseClaimsJws(token)
            .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(
                    Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8))
                )
                .build()
                .parseClaimsJws(authToken);
            return true;
        } catch (SecurityException ex) {
            logger.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty");
        }
        return false;
    }
}

/**
 * Authentication Controller for handling login, registration, and token refresh
 */
@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * User login endpoint with comprehensive security checks
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(
        @Valid @RequestBody LoginRequest loginRequest
    ) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            // Set authentication context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate JWT token
            String jwt = tokenProvider.generateToken(authentication);

            // Log login attempt
            userService.recordUserLogin(loginRequest.getUsername());

            // Return token and user details
            return ResponseEntity.ok(
                new JwtAuthenticationResponse(
                    jwt, 
                    userService.getUserDetails(loginRequest.getUsername())
                )
            );
        } catch (BadCredentialsException ex) {
            // Handle invalid credentials
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Authentication failed", "Invalid username or password"));
        }
    }

    /**
     * User registration endpoint with role-based registration
     */
    @PostMapping("/register")
    @PreAuthorize("hasRole('STORE_MANAGER')")
    public ResponseEntity<?> registerUser(
        @Valid @RequestBody UserRegistrationRequest registrationRequest
    ) {
        // Validate registration request
        if (userService.existsByUsername(registrationRequest.getUsername())) {
            return ResponseEntity
                .badRequest()
                .body(new ErrorResponse("Registration failed", "Username is already taken"));
        }

        // Create new user
        User newUser = userService.createUser(
            registrationRequest.getUsername(),
            registrationRequest.getPassword(),
            registrationRequest.getRole(),
            registrationRequest.getFullName(),
            registrationRequest.getEmail)
        );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(new UserRegistrationResponse(newUser.getId(), newUser.getUsername()));
    }

    /**
     * Token refresh endpoint for managing long-running sessions
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(
        @RequestHeader("Authorization") String refreshToken
    ) {
        try {
            // Validate and refresh token
            String newToken = tokenProvider.refreshToken(refreshToken);
            return ResponseEntity.ok(new TokenRefreshResponse(newToken));
        } catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Token refresh failed", ex.getMessage()));
        }
    }
}

/**
 * Custom User Details Service for loading user-specific data
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) 
        throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> 
                new UsernameNotFoundException("User not found with username: " + username)
            );

        return UserPrincipal.create(user);
    }
}

/**
 * User Principal representing authenticated user
 */
public class UserPrincipal implements UserDetails {
    private Long id;
    private String username;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    // Constructor, getters, and implementation of UserDetails methods
    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_" + user.getRole())
        );

        return new UserPrincipal(
            user.getId(),
            user.getUsername(),
            user.getPassword(),
            authorities
        );
    }
}

// DTOs (Data Transfer Objects)
public class LoginRequest {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}

public class UserRegistrationRequest {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "SALES_STAFF|INVENTORY_STAFF|STORE_MANAGER", 
             message = "Invalid role")
    private String role;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Invalid email format")
    private String email;
}

public class JwtAuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private UserDetailsDTO userDetails;
}

public class TokenRefreshResponse {
    private String accessToken;
    private String tokenType = "Bearer";
}

public class ErrorResponse {
    private String message;
    private String details;
}
```