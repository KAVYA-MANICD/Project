package com.example.Invoice.API.Controller;

import com.example.Invoice.API.Modal.Payroll;
import com.example.Invoice.API.Repository.PayrollRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "http://localhost:4200")
public class PayrollController {
    @Autowired
    private PayrollRepo payrollRepo;

    // Create new payroll entry
//    @PostMapping
//    public ResponseEntity<Payroll> createPayroll(@RequestBody Payroll payroll) {
//        try {
//            Payroll savedPayroll = payrollRepo.save(payroll);
//            return ResponseEntity.ok(savedPayroll);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().build();
//        }
//    }


    @PostMapping
    public ResponseEntity<Payroll> createPayroll(@RequestBody Payroll payroll) {
        try {
            System.out.println("Received Payroll: " + payroll); // Log the received payroll
            Payroll savedPayroll = payrollRepo.save(payroll);
            return ResponseEntity.ok(savedPayroll);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }


    // Get all payroll entries
    @GetMapping
    public ResponseEntity<List<Payroll>> getAllPayrolls() {
        try {
            List<Payroll> payrolls = payrollRepo.findAll();
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get payroll by ID
    @GetMapping("/{id}")
    public ResponseEntity<Payroll> getPayrollById(@PathVariable Long id) {
        return payrollRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get payrolls by employee ID
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Payroll>> getPayrollsByEmployeeId(@PathVariable String employeeId) {
        try {
            List<Payroll> payrolls = payrollRepo.findByEmployeeId(employeeId);
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Update payroll
    @PutMapping("/{id}")
    public ResponseEntity<Payroll> updatePayroll(@PathVariable Long id, @RequestBody Payroll payroll) {
        if (!payrollRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        payroll.setId(id);
        Payroll updatedPayroll = payrollRepo.save(payroll);
        return ResponseEntity.ok(updatedPayroll);
    }

    // Delete payroll
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayroll(@PathVariable Long id) {
        if (!payrollRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        payrollRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
