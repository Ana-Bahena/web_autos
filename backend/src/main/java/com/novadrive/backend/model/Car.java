package com.novadrive.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String marca;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal precio;

    @Column(name = "ao", nullable = false)
    private Integer ao;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String imagen;

    @Column(nullable = false, length = 50)
    private String categoria;

    @Column(length = 50)
    private String velocidad;

    @Column(length = 50)
    private String aceleracion;

    @Column(nullable = false)
    private Integer status = 1;

    @Column
    private Integer stock;

    // Constructors
    public Car() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public Integer getAo() { return ao; }
    public void setAo(Integer ao) { this.ao = ao; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getVelocidad() { return velocidad; }
    public void setVelocidad(String velocidad) { this.velocidad = velocidad; }

    public String getAceleracion() { return aceleracion; }
    public void setAceleracion(String aceleracion) { this.aceleracion = aceleracion; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}
