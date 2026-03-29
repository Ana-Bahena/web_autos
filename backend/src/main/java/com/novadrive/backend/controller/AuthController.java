package com.novadrive.backend.controller;

import com.novadrive.backend.dto.AuthResponse;
import com.novadrive.backend.dto.LoginRequest;
import com.novadrive.backend.dto.RegisterRequest;
import com.novadrive.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/register
     * Registra un nuevo usuario.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * POST /api/auth/login
     * Autentica a un usuario existente.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(response);
        }
    }

    /**
     * GET /api/auth/health
     * Endpoint de salud para verificar que el backend está corriendo.
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("✅ NovaDrive Backend API está funcionando correctamente.");
    }
}
