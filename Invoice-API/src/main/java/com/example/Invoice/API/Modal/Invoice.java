package com.example.Invoice.API.Modal;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String invoiceNumber; // Auto-generated

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    private String productOrService;

    private Integer quantity;

    private Double rate;

    private Double subtotal;

    private Double taxes;

    private Double total;

    private LocalDate date;

    private String description;

    @PrePersist
    public void prePersist() {
        this.invoiceNumber = "INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.date = LocalDate.now();
    }
}
