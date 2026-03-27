package com.novadrive.backend.controller;

import com.novadrive.backend.model.User;
import com.novadrive.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // GET all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET by id
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create user
    @PostMapping
    public User createUser(@RequestBody User user) {
        user.setId(null);
        // Encriptar password antes de guardar
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            user.setPassword("12345678"); // Default password
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // PUT update user
    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setFullName(userDetails.getFullName());
            user.setEmail(userDetails.getEmail());
            user.setRole(userDetails.getRole());
            
            // Solo actualizar password si se envía uno nuevo
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty() && !userDetails.getPassword().startsWith("$2a$")) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }
            
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE user
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
