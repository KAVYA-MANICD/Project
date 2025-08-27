package com.example.Invoice.API.Modal;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
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

    private String invoiceNumber;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    private String productOrService;

    private Integer quantity;

    private Double rate;

    private Double subtotal;

    private Double taxes;

    private Double total;

    @NotNull
    private LocalDate date;

    private String description;

    private boolean isSuspicious;

    // Static map to track daily invoice counters
    private static final Map<String, Integer> dailyInvoiceCounter = new HashMap<>();

    @PrePersist
    public void prePersist() {
        if (this.invoiceNumber == null || this.invoiceNumber.isEmpty()) {
            this.invoiceNumber = generateInvoiceNumber();
        }
        if (this.date == null) {
            this.date = LocalDate.now();
        }
    }

    private String generateInvoiceNumber() {
        String datePart = new SimpleDateFormat("yyyyMMdd").format(new Date());
        int count = dailyInvoiceCounter.getOrDefault(datePart, 0) + 1;
        dailyInvoiceCounter.put(datePart, count);

        String sequencePart = String.format("%04d", count);
        return "INV-" + datePart + "-" + sequencePart;
    }
}
