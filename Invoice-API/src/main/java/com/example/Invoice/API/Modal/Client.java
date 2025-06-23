package com.example.Invoice.API.Modal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String companyName; // Company Name
    private String taxId; // GSTIN / Tax ID
    private String billingAddress;
    private String shippingAddress;
    private String country;
    private String state;
    private String city;
    private String zipCode;
}
