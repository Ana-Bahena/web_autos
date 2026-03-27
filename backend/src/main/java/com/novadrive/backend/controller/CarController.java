package com.novadrive.backend.controller;

import com.novadrive.backend.model.Car;
import com.novadrive.backend.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "http://localhost:4200")
public class CarController {

    @Autowired
    private CarRepository carRepository;

    // GET all cars
    @GetMapping
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    // GET by id
    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        return carRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create car
    @PostMapping
    public Car createCar(@RequestBody Car car) {
        car.setId(null); // Forzar INSERT (ignorar cualquier id del body)
        return carRepository.save(car);
    }

    // PUT update car — @Transactional mantiene la entidad managed durante todo el método
    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable Long id, @RequestBody Car carDetails) {
        return carRepository.findById(id).map(car -> {
            car.setName(carDetails.getName());
            car.setMarca(carDetails.getMarca());
            car.setPrecio(carDetails.getPrecio());
            car.setAo(carDetails.getAo());
            car.setImagen(carDetails.getImagen());
            car.setCategoria(carDetails.getCategoria());
            car.setVelocidad(carDetails.getVelocidad());
            car.setAceleracion(carDetails.getAceleracion());
            car.setStatus(carDetails.getStatus());
            car.setStock(carDetails.getStock());
            // Con @Transactional, el dirty-checking de JPA hace el UPDATE automáticamente
            // pero save() explícito también funciona correctamente aquí
            return ResponseEntity.ok(carRepository.save(car));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE car
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        return carRepository.findById(id).map(car -> {
            carRepository.delete(car);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
