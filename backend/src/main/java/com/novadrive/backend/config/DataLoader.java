package com.novadrive.backend.config;

import com.novadrive.backend.model.User;
import com.novadrive.backend.repository.CarRepository;
import com.novadrive.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Carga datos de prueba al iniciar la aplicación.
 * Crea un usuario admin por defecto para que puedas probar el login
 * inmediatamente.
 */
@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Solo insertar si no hay usuarios
        if (userRepository.count() == 0) {

            // Usuario Admin por defecto
            User admin = new User();
            admin.setFullName("Admin NovaDrive");
            admin.setEmail("admin@novadrive.com");
            admin.setPassword(passwordEncoder.encode("Admin1234!"));
            admin.setRole("ADMIN");
            userRepository.save(admin);

            // Usuario de prueba
            User demo = new User();
            demo.setFullName("Juan Pérez");
            demo.setEmail("juan@demo.com");
            demo.setPassword(passwordEncoder.encode("Demo12345"));

            demo.setRole("USER");
            userRepository.save(demo);

            System.out.println("✅ Datos de prueba cargados:");
            System.out.println("   👤 admin@novadrive.com / Admin1234!");
            System.out.println("   👤 juan@demo.com / Demo12345");
        }
    }
}
