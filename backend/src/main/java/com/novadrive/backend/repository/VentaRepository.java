package com.novadrive.backend.repository;

import com.novadrive.backend.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    
    // Find all sales for a specific user
    List<Venta> findByUserEmail(String email);
    
    // Find sales by user ID
    List<Venta> findByUserId(Long userId);
}
