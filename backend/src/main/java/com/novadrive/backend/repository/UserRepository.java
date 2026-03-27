package com.novadrive.backend.repository;

import com.novadrive.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Buscar usuario por email (para login y perfil)
    Optional<User> findByEmail(String email);

    // Verificar si ya existe un usuario con ese email (para registro)
    boolean existsByEmail(String email);
}
