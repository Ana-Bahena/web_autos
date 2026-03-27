package com.novadrive.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    @NotBlank(message = "Debes verificar que no eres un robot")
    private String captchaToken;

    // Constructors
    public LoginRequest() {}

    public LoginRequest(String email, String password, String captchaToken) {
        this.email = email;
        this.password = password;
        this.captchaToken = captchaToken;
    }

    // Getters & Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getCaptchaToken() { return captchaToken; }
    public void setCaptchaToken(String captchaToken) { this.captchaToken = captchaToken; }
}
