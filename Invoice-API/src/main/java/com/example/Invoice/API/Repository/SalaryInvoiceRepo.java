package com.example.Invoice.API.Repository;

import com.example.Invoice.API.Modal.SalaryInvoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalaryInvoiceRepo extends JpaRepository<SalaryInvoice,Long> {
    List<SalaryInvoice> findByEmployeeId(String employeeId);
}
