package com.novadrive.backend.service;

import com.novadrive.backend.dto.AuthResponse;
import com.novadrive.backend.dto.LoginRequest;
import com.novadrive.backend.dto.RegisterRequest;
import com.novadrive.backend.model.User;
import com.novadrive.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Registra un nuevo usuario en la base de datos.
     * Valida que las contraseñas coincidan y que el email no esté registrado.
     */
    public AuthResponse register(RegisterRequest request) {

        // Validar que las contraseñas coincidan
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return new AuthResponse(false, "Las contraseñas no coinciden.");
        }

        // Verificar si el email ya está en uso
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(false, "El email ya está registrado.");
        }

        // Crear y guardar el nuevo usuario
        User newUser = new User();
        newUser.setFullName(request.getFullName());
        newUser.setEmail(request.getEmail());
        // *** IMPORTANTE: encriptamos la contraseña antes de guardar ***
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole("USER");

        userRepository.save(newUser);

        // Generar token simple (UUID)
        String token = UUID.randomUUID().toString();

        return new AuthResponse(
                true,
                "¡Cuenta creada exitosamente! Bienvenido a NovaDrive.",
                token,
                newUser.getFullName(),
                newUser.getEmail(),
                newUser.getRole(),
                newUser.getId());
    }

    /**
     * Autentica a un usuario con email y contraseña.
     */
    public AuthResponse login(LoginRequest request) {
        // Verificar captcha (simulación de 'No soy un robot')
        if (request.getCaptchaToken() == null || !request.getCaptchaToken().equals("NO_ROBOT_VERIFIED")) {
            return new AuthResponse(false, "Verificación de seguridad fallida: Por favor marca 'No soy un robot'.");
        }

        // Buscar usuario por email
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "Correo o contraseña incorrectos.");
        }

        User user = userOpt.get();

        // Verificar contraseña encriptada
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(false, "Correo o contraseña incorrectos.");
        }

        // Generar token simple (en producción usaríamos JWT)
        String token = UUID.randomUUID().toString();

        return new AuthResponse(
                true,
                "Inicio de sesión exitoso. ¡Bienvenido, " + user.getFullName() + "!",
                token,
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getId());
    }
}
