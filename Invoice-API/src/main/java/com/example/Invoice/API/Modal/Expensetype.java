package com.example.Invoice.API.Modal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "expense_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Expensetype {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long expenseId;

    @Column(unique = true)
    private String expenseType;
}

