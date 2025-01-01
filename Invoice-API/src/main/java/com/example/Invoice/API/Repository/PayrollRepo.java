package com.example.Invoice.API.Repository;

import com.example.Invoice.API.Modal.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface PayrollRepo extends JpaRepository<Payroll,Long> {
    List<Payroll> findByEmployeeId(String employeeId);
}
