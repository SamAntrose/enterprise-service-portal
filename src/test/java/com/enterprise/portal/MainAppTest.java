package com.enterprise.portal;

import com.enterprise.portal.dto.AuthResponse;
import com.enterprise.portal.dto.LoginRequest;
import com.enterprise.portal.dto.OtpVerifyRequest;
import com.enterprise.portal.dto.TicketCreateRequest;
import com.enterprise.portal.model.*;
import com.enterprise.portal.service.AuthService;
import com.enterprise.portal.service.OtpService;
import com.enterprise.portal.service.TicketService;
import com.enterprise.portal.util.PasswordHasher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class MainAppTest {

    private AuthService authService;
    private OtpService otpService;
    private TicketService ticketService;

    @BeforeEach
    public void setUp() {
        otpService = new OtpService();
        authService = new AuthService();
        ticketService = new TicketService();
    }

    @Test
    @DisplayName("Week 3 Test: BCrypt Password Hashing & Verification")
    public void testPasswordHasher() {
        String plainPassword = "MySecretPassword123!";
        String hashed = PasswordHasher.hashPassword(plainPassword);

        assertNotNull(hashed);
        assertTrue(hashed.startsWith("$2a$"));
        assertTrue(PasswordHasher.checkPassword(plainPassword, hashed));
        assertFalse(PasswordHasher.checkPassword("WrongPassword", hashed));
    }

    @Test
    @DisplayName("Week 3 Test: 2FA OTP Generation & Validation Workflow")
    public void testOtpWorkflow() {
        String userEmail = "testuser@company.com";
        String otpCode = otpService.generateOtp(userEmail);

        assertNotNull(otpCode);
        assertEquals(6, otpCode.length());

        // Validate correct OTP
        boolean isValid = otpService.validateOtp(userEmail, otpCode);
        assertTrue(isValid, "OTP validation should succeed for correct code");

        // Single-use check (second validation of same OTP should fail)
        boolean isReusedValid = otpService.validateOtp(userEmail, otpCode);
        assertFalse(isReusedValid, "OTP cannot be re-used twice");
    }

    @Test
    @DisplayName("Week 3 Test: Full 2-Step Login Authentication with OTP")
    public void testTwoStepAuthentication() {
        // Step 1: Initiate Login with Email & Password
        LoginRequest loginReq = new LoginRequest("alice@company.com", "AdminPass123!");
        AuthResponse step1Response = authService.initiateLogin(loginReq);

        assertTrue(step1Response.isSuccess());
        assertTrue(step1Response.isRequiresOtp());

        // Extract generated OTP code for test validation
        String message = step1Response.getMessage();
        String otpCode = message.substring(message.indexOf("[Demo Code: ") + 12, message.indexOf("]"));

        // Step 2: Complete Login with OTP Verification
        OtpVerifyRequest verifyReq = new OtpVerifyRequest("alice@company.com", otpCode);
        AuthResponse step2Response = authService.verifyOtpAndLogin(verifyReq);

        assertTrue(step2Response.isSuccess());
        assertNotNull(step2Response.getToken());
        assertNotNull(step2Response.getUser());
        assertEquals("alice@company.com", step2Response.getUser().getEmail());
        assertEquals(Role.EMPLOYEE, step2Response.getUser().getRole());
    }

    @Test
    @DisplayName("Week 4 Test: Ticket Lifecycle Management & Role-Based Filtering")
    public void testTicketLifecycle() {
        // Fetch demo employee user
        AuthResponse authRes = authService.registerUser("Charlie Tech", "charlie@company.com", "Pass123!", Role.EMPLOYEE, null);
        User employee = authRes.getUser();

        // Create a new ticket
        TicketCreateRequest ticketReq = new TicketCreateRequest();
        ticketReq.setTitle("Laptop screen flickering and overheating");
        ticketReq.setDescription("My workstation screen flickers repeatedly whenever opening heavy applications.");
        ticketReq.setLocation("Building A, Floor 3, Desk 304");
        ticketReq.setCategoryId(1); // Hardware
        ticketReq.setPriority("P2_HIGH");

        Ticket createdTicket = ticketService.createTicket(ticketReq, employee);

        assertNotNull(createdTicket);
        assertTrue(createdTicket.getTicketCode().startsWith("TICK-"));
        assertEquals("Laptop screen flickering and overheating", createdTicket.getTitle());
        assertEquals(TicketStatus.SUBMITTED, createdTicket.getStatus());
        assertEquals(TicketPriority.P2_HIGH, createdTicket.getPriority());

        // Verify ticket retrieval by user
        List<Ticket> employeeTickets = ticketService.getTicketsForUser(employee);
        assertFalse(employeeTickets.isEmpty());

        // Update Ticket Status (Submitted -> In Progress -> Resolved)
        boolean statusUpdated = ticketService.updateTicketStatus(createdTicket.getId(), TicketStatus.IN_PROGRESS, employee);
        assertTrue(statusUpdated);

        Optional<Ticket> updatedTicketOpt = ticketService.getTicketById(createdTicket.getId());
        assertTrue(updatedTicketOpt.isPresent());
        assertEquals(TicketStatus.IN_PROGRESS, updatedTicketOpt.get().getStatus());
    }
}
