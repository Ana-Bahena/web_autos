package com.novadrive.backend.dto;

public class AuthResponse {

    private boolean success;
    private String message;
    private String token; // Session token simple
    private String fullName;
    private String email;
    private String role;
    private Long userId;

    // Constructor para respuesta exitosa
    public AuthResponse(boolean success, String message, String token, String fullName, String email, String role, Long userId) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.userId = userId;
    }

    // Constructor para respuesta de error
    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getters & Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
