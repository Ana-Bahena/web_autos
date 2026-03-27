package com.novadrive.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "venta")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "users_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    @Column(nullable = false)
    private BigDecimal precioTotal;

    @Column(nullable = false)
    private Integer status = 1; // 1 = vendido, 0 = pendiente

    @Column(name = "fecha_venta", nullable = false, updatable = false)
    private LocalDateTime fechaVenta;

    @PrePersist
    protected void onCreate() {
        fechaVenta = LocalDateTime.now();
    }

    // ── Constructors ──────────────────────────────────────────────────────────
    public Venta() {}

    public Venta(User user, Car car, BigDecimal precioTotal, Integer status) {
        this.user = user;
        this.car = car;
        this.precioTotal = precioTotal;
        this.status = status;
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Car getCar() { return car; }
    public void setCar(Car car) { this.car = car; }

    public BigDecimal getPrecioTotal() { return precioTotal; }
    public void setPrecioTotal(BigDecimal precioTotal) { this.precioTotal = precioTotal; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }

    public LocalDateTime getFechaVenta() { return fechaVenta; }
    public void setFechaVenta(LocalDateTime fechaVenta) { this.fechaVenta = fechaVenta; }
}
