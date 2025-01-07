package com.example.Invoice.API.Modal;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "payroll")
public class Payroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String employeeName;

    @Column(nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private BigDecimal basicSalary;



    @Column(nullable = false)
    private BigDecimal allowanceAmount;

    @Column(nullable = false)
    private BigDecimal deductions;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false, unique = true)
    private String invoiceNumber; // Added invoice number field

//    @ManyToOne
//    @JoinColumn(name = "invoice_id")
//    private Invoice invoice;


    @Column(nullable = false)
    private LocalDate date = LocalDate.now();

    @PrePersist
    public void generateInvoiceNumberAndSetDate() {
        this.invoiceNumber = "INV-" + System.currentTimeMillis() + "-" + (int) (Math.random() * 10000);
        this.date = LocalDate.now(); // Automatically sets the current date when persisting
    }
//    @PrePersist
//    public void generateInvoiceNumber() {
//        this.invoiceNumber = "INV-" + System.currentTimeMillis() + "-" + (int) (Math.random() * 10000);
//    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public BigDecimal getBasicSalary() {
        return basicSalary;
    }

    public void setBasicSalary(BigDecimal basicSalary) {
        this.basicSalary = basicSalary;
    }

    public BigDecimal getAllowanceAmount() {
        return allowanceAmount;
    }

    public void setAllowanceAmount(BigDecimal allowanceAmount) {
        this.allowanceAmount = allowanceAmount;
    }

    public BigDecimal getDeductions() {
        return deductions;
    }

    public void setDeductions(BigDecimal deductions) {
        this.deductions = deductions;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

//    public Invoice getInvoice() {
//        return invoice;
//    }
//
//    public void setInvoice(Invoice invoice) {
//        this.invoice = invoice;
//    }
}