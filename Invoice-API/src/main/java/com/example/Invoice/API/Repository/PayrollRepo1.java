package com.example.Invoice.API.Repository;

import com.example.Invoice.API.Modal.Payroll1;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PayrollRepo1 extends JpaRepository<Payroll1,Long> {
    List<Payroll1> findByEmployeeId(String employeeId);
}
