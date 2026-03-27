package com.novadrive.backend.controller;

import com.novadrive.backend.model.Car;
import com.novadrive.backend.model.User;
import com.novadrive.backend.model.Venta;
import com.novadrive.backend.repository.CarRepository;
import com.novadrive.backend.repository.UserRepository;
import com.novadrive.backend.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "http://localhost:4200")
public class VentaController {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    // GET all sales (Admin)
    @GetMapping
    public List<Venta> getAllSales() {
        return ventaRepository.findAll();
    }

    // GET sales for specific user (Customer)
    @GetMapping("/user/{email}")
    public List<Venta> getSalesByUser(@PathVariable String email) {
        return ventaRepository.findByUserEmail(email);
    }

    // POST — Checkout (Generate Sale)
    @Transactional
    @PostMapping
    public ResponseEntity<?> createSale(@RequestBody VentaRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        Optional<Car> carOpt = carRepository.findById(request.getCarId());

        if (userOpt.isEmpty() || carOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario o Carro no encontrado.");
        }

        User user = userOpt.get();
        Car car = carOpt.get();

        // Validar stock
        if (car.getStock() <= 0) {
            return ResponseEntity.badRequest().body("Producto sin stock.");
        }

        // Crear venta
        Venta venta = new Venta();
        venta.setUser(user);
        venta.setCar(car);
        venta.setPrecioTotal(car.getPrecio());
        venta.setStatus(1); // 1 = Vendido

        // Decrementar stock
        car.setStock(car.getStock() - 1);
        if (car.getStock() == 0) {
            car.setStatus(0); // Agotado
        }
        carRepository.save(car);

        return ResponseEntity.ok(ventaRepository.save(venta));
    }

    // DELETE sale (Admin)
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSale(@PathVariable Long id) {
        ventaRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

/**
 * DTO para la creación de ventas simplificada desde el frontend.
 */
class VentaRequest {
    private Long userId;
    private Long carId;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }
}
