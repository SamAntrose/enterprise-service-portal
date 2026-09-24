package com.enterprise.portal.service;

import com.enterprise.portal.dto.AuthResponse;
import com.enterprise.portal.dto.LoginRequest;
import com.enterprise.portal.dto.RegisterRequest;
import com.enterprise.portal.model.Role;
import com.enterprise.portal.model.User;
import com.enterprise.portal.repository.UserRepository;
import com.enterprise.portal.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditLogService auditLogService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider, AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User with email " + request.getEmail() + " already exists.");
        }

        Role role = Role.fromString(request.getRole());
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(role);
        user.setDepartment(request.getDepartment() != null ? request.getDepartment() : "General");
        user.setPhoneNumber(request.getPhoneNumber());
        user.setActive(true);

        User savedUser = userRepository.save(user);

        String token = tokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole().name());

        auditLogService.logAction(savedUser.getEmail(), savedUser.getRole().name(), "USER_REGISTER", "New user registered with role " + savedUser.getRole());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUserId(savedUser.getId());
        response.setEmail(savedUser.getEmail());
        response.setFullName(savedUser.getFullName());
        response.setRole(savedUser.getRole());
        response.setDepartment(savedUser.getDepartment());
        response.setRequiresOtp(false);

        return response;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            auditLogService.logAction(request.getEmail(), "UNKNOWN", "LOGIN_FAILED", "Invalid password attempt");
            throw new IllegalArgumentException("Invalid email or password.");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());

        auditLogService.logAction(user.getEmail(), user.getRole().name(), "USER_LOGIN", "Successful login");

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());
        response.setDepartment(user.getDepartment());
        response.setRequiresOtp(false);

        return response;
    }
}
