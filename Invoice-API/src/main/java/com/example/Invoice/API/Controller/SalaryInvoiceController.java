package com.example.Invoice.API.Controller;

import com.example.Invoice.API.Modal.SalaryInvoice;
import com.example.Invoice.API.Repository.SalaryInvoiceRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.util.List;

//@CrossOrigin(origins = "http://localhost:4200")
//@RestController
//@RequestMapping("/api/invoices")

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/admin/invoice")

public class SalaryInvoiceController {

    @Autowired
    private SalaryInvoiceRepo salaryInvoiceRepo;

    @PostMapping("/generate")
    public ResponseEntity<?> generateInvoice(@RequestBody SalaryInvoice salaryInvoice) {
        try {
            SalaryInvoice savedInvoice = salaryInvoiceRepo.save(salaryInvoice);
            return ResponseEntity.ok().body(savedInvoice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error generating invoice: " + e.getMessage());
        }
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadInvoices() {
        List<SalaryInvoice> invoices = salaryInvoiceRepo.findAll();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintWriter pw = new PrintWriter(baos);

        // Write CSV header
        pw.println("Employee ID,Employee Name,Basic Salary,Allowances,Deductions,Total Salary,Payment Date,Generated Date");

        // Write data rows
        for (SalaryInvoice invoice : invoices) {
            pw.println(String.format("%s,%s,%.2f,%.2f,%.2f,%.2f,%s,%s",
                    invoice.getEmployeeId(),
                    invoice.getEmployeeName(),
                    invoice.getBasicSalary(),
                    invoice.getAllowances(),
                    invoice.getDeductions(),
                    invoice.getTotalSalary(),
                    invoice.getPaymentDate(),
                    invoice.getGeneratedDate()
            ));
        }
        pw.close();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "salary_invoices.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(baos.toByteArray());
    }
}



//    @Autowired
//    private SalaryInvoiceRepo salaryInvoiceRepo;
//
//    @PostMapping
//    public ResponseEntity<?> createInvoice(@RequestBody SalaryInvoice invoice) {
//        salaryInvoiceRepo.save(invoice);
//        return ResponseEntity.ok().body("Invoice created successfully");
//    }
//
//    @GetMapping
//    public List<SalaryInvoice> getAllInvoices() {
//        return salaryInvoiceRepo.findAll();
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> deleteInvoice(@PathVariable Long id) {
//        salaryInvoiceRepo.deleteById(id);
//        return ResponseEntity.ok().body("Invoice deleted successfully");
//    }
//
//}
