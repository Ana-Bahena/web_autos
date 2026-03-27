package com.novadrive.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Encoder BCrypt para encriptar contraseñas.
     * BCrypt es de los más seguros para passwords.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configuración de seguridad HTTP:
     * - Deshabilitamos CSRF (sin sesiones, usamos tokens)
     * - Permitimos todas las rutas de /api/auth/** sin autenticación
     * - Las demás rutas requieren autenticación
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas (no requieren token)
                    .requestMatchers("/api/auth/**").permitAll() // Login/Registro
                    .requestMatchers("/api/cars/**").permitAll() // Listado público
                    // Estos endpoints requerirían .authenticated() o .hasRole("ADMIN") en producción real
                    .requestMatchers("/api/users/**").permitAll() 
                    .requestMatchers("/api/ventas/**").permitAll()
                        // Console H2 (base de datos - solo para desarrollo)
                        .requestMatchers("/h2-console/**").permitAll()
                        // Todas las demás requieren autenticación
                        .anyRequest().authenticated())
                // Permitir frames para la consola H2
                .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}
