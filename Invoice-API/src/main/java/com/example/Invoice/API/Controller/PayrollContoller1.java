package com.example.Invoice.API.Controller;


import com.example.Invoice.API.Modal.Payroll1;

import com.example.Invoice.API.Repository.PayrollRepo1;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.opencsv.CSVWriter;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.math.BigDecimal;
import java.nio.file.Paths;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import com.itextpdf.text.Font;


@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "http://localhost:4200")

public class PayrollContoller1 {

    @Autowired
    private PayrollRepo1 payrollRepo1;



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayroll(@PathVariable Long id) {
        try {
            if (!payrollRepo1.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            payrollRepo1.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/generate-pdf/{id}")
    public ResponseEntity<byte[]> generatePDF(@PathVariable Long id) {
        try {
            Payroll1 payroll = payrollRepo1.findById(id)
                    .orElseThrow(() -> new RuntimeException("Payroll not found"));

            System.out.println("Bank Details:");
            System.out.println("Bank Name: " + payroll.getBankName());
            System.out.println("Account Number: " + payroll.getAccountNumber());
            System.out.println("IFSC Code: " + payroll.getIfscCode());
            System.out.println("Transaction ID: " + payroll.getTransactionId());
            System.out.println("Transaction Date: " + payroll.getTransactionDate());

            Document document = new Document(PageSize.A4);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, baos);

            document.open();

            // Company Header
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Paragraph header = new Paragraph("JUPITER KING TECHNOLOGIES", headerFont);
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);

            // Company Details
            Font normalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
            Paragraph companyDetails = new Paragraph(
                    "Address: Nrupathunga Road, Kuvempunagar, Mysore\n" +
                            "Phone: 91+ 7259489277\n" +
                            "Email: jupiterkingtechnologies@gmail.com\n",
                    normalFont
            );
            companyDetails.setAlignment(Element.ALIGN_CENTER);
            document.add(companyDetails);

            document.add(new Paragraph("\n"));

            // Invoice Title
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);
            Paragraph invoiceTitle = new Paragraph("Payroll Invoice", titleFont);
            invoiceTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(invoiceTitle);

            document.add(new Paragraph("\n"));

            // Basic Invoice Details
            PdfPTable basicDetails = new PdfPTable(2);
            basicDetails.setWidthPercentage(100);
            basicDetails.setSpacingBefore(10f);
            basicDetails.setSpacingAfter(10f);

            addTableCell(basicDetails, "Invoice Number:", payroll.getInvoiceNumber());
            addTableCell(basicDetails, "Date:", new SimpleDateFormat("dd/MM/yyyy").format(new Date()));
            document.add(basicDetails);

            // Employee Details
            Font subHeaderFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);
            Paragraph employeeHeader = new Paragraph("Employee Details", subHeaderFont);
            document.add(employeeHeader);
            document.add(new Paragraph("\n"));

            PdfPTable employeeDetails = new PdfPTable(2);
            employeeDetails.setWidthPercentage(100);
            employeeDetails.setSpacingBefore(10f);
            employeeDetails.setSpacingAfter(10f);

            addTableCell(employeeDetails, "Employee Name:", payroll.getEmployeeName());
            addTableCell(employeeDetails, "Employee ID:", payroll.getEmployeeId());
            document.add(employeeDetails);

            // Salary Breakdown
            Paragraph salaryHeader = new Paragraph("Salary Details", subHeaderFont);
            document.add(salaryHeader);
            document.add(new Paragraph("\n"));

            PdfPTable salaryTable = new PdfPTable(2);
            salaryTable.setWidthPercentage(100);
            salaryTable.setSpacingBefore(10f);
            salaryTable.setSpacingAfter(10f);

            addTableCell(salaryTable, "Basic Salary:", formatCurrency(payroll.getBasicSalary()));
            addTableCell(salaryTable, "Allowance:", formatCurrency(payroll.getAllowanceAmount()));
            addTableCell(salaryTable, "Deductions:", formatCurrency(payroll.getDeductions()));
            addTableCell(salaryTable, "Total Amount:", formatCurrency(payroll.getTotalAmount()));
            document.add(salaryTable);

            // Bank Transaction Details
            Paragraph bankHeader = new Paragraph("Bank Transaction Details", new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD));
            document.add(bankHeader);
            document.add(new Paragraph("\n"));

            PdfPTable bankDetails = new PdfPTable(2);
            bankDetails.setWidthPercentage(100);
            bankDetails.setSpacingBefore(10f);
            bankDetails.setSpacingAfter(10f);

// Add bank details with null checks
            addTableCell(bankDetails, "Bank Name:",
                    payroll.getBankName() != null ? payroll.getBankName() : "Not Provided");
            addTableCell(bankDetails, "Account Number:",
                    payroll.getAccountNumber() != null ? payroll.getAccountNumber() : "Not Provided");
            addTableCell(bankDetails, "IFSC Code:",
                    payroll.getIfscCode() != null ? payroll.getIfscCode() : "Not Provided");
            addTableCell(bankDetails, "Transaction ID:",
                    payroll.getTransactionId() != null ? payroll.getTransactionId() : "Pending");
            addTableCell(bankDetails, "Transaction Date:",
                    payroll.getTransactionDate() != null ?
                            new SimpleDateFormat("dd/MM/yyyy").format(payroll.getTransactionDate()) : "Pending");

            document.add(bankDetails);
            // Footer
            document.add(new Paragraph("\n"));
            Font italicFont = new Font(Font.FontFamily.HELVETICA, 10, Font.ITALIC);
            Paragraph footer = new Paragraph("This is a computer-generated document. No signature is required.",
                    italicFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.builder("attachment")
                    .filename("payroll_" + payroll.getInvoiceNumber() + ".pdf").build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(baos.toByteArray());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    private String formatCurrency(BigDecimal amount) {
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "US"));
        DecimalFormat decimalFormat = (DecimalFormat) currencyFormat;
        decimalFormat.setMinimumFractionDigits(2);
        decimalFormat.setMaximumFractionDigits(2);
        return currencyFormat.format(amount);
    }

    private void addTableCell(PdfPTable table, String label, String value) {
        Font boldFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
        Font normalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);

        PdfPCell labelCell = new PdfPCell(new Phrase(label, boldFont));
        labelCell.setPadding(5);
        labelCell.setBorder(Rectangle.NO_BORDER);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, normalFont));
        valueCell.setPadding(5);
        valueCell.setBorder(Rectangle.NO_BORDER);
        table.addCell(valueCell);
    }


    //    private static final String CSV_DOWNLOAD_PATH = "C:/Users/nithya prashanth/Desktop/images/Invoice";
//    @GetMapping("/download-csv/{id}")
//    public ResponseEntity<Void> downloadCSV(@PathVariable Long id) {
//        try {
//            Payroll1 payroll = payrollRepo1.findById(id)
//                    .orElseThrow(() -> new RuntimeException("Payroll not found"));
//
//            File directory = new File(CSV_DOWNLOAD_PATH);
//            if (!directory.exists()) {
//                directory.mkdirs();
//            }
//
//            String fileName = "payroll_" + payroll.getInvoiceNumber() + ".csv";
//            File file = new File(directory, fileName);
//
//            try (FileWriter writer = new FileWriter(file)) {
//                CSVWriter csvWriter = new CSVWriter(writer);
//
//                String[] headers = {"Invoice Number", "Employee Name", "Employee ID", "Basic Salary",
//                        "Allowance", "Deductions", "Total Amount"};
//                csvWriter.writeNext(headers);
//
//                String[] data = {
//                        payroll.getInvoiceNumber(),
//                        payroll.getEmployeeName(),
//                        payroll.getEmployeeId(),
//                        payroll.getBasicSalary().toString(),
//                        payroll.getAllowanceAmount().toString(),
//                        payroll.getDeductions().toString(),
//                        payroll.getTotalAmount().toString()
//                };
//                csvWriter.writeNext(data);
//                csvWriter.close();
//
//                return ResponseEntity.ok().build();
//            }
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }


    // Common base path where the folders will be created dynamically
    private static final String BASE_DIR = Paths.get(System.getProperty("user.home"), "InvoiceData").toString();

    @PostConstruct
    public void init() {
        // Create the base directory if it doesn't exist
        File baseDir = new File(BASE_DIR);
        if (!baseDir.exists()) {
            boolean created = baseDir.mkdirs();
            if (created) {
                System.out.println("Created base directory: " + BASE_DIR);
            } else {
                System.out.println("Failed to create base directory: " + BASE_DIR);
            }
        }
    }

    @GetMapping("/download-csv/{id}")
    public ResponseEntity<Void> downloadCSV(@PathVariable Long id) {
        try {
            Payroll1 payroll = payrollRepo1.findById(id)
                    .orElseThrow(() -> new RuntimeException("Payroll not found"));

            File directory = new File(BASE_DIR);
            if (!directory.exists()) {
                directory.mkdirs(); // Create the directory if not already present
            }

            String fileName = "payroll_" + payroll.getInvoiceNumber() + ".csv";
            File file = new File(directory, fileName);

            try (FileWriter writer = new FileWriter(file)) {
                CSVWriter csvWriter = new CSVWriter(writer);

                String[] headers = {"Invoice Number", "Employee Name", "Employee ID", "Basic Salary",
                        "Allowance", "Deductions", "Total Amount"};
                csvWriter.writeNext(headers);

                String[] data = {
                        payroll.getInvoiceNumber(),
                        payroll.getEmployeeName(),
                        payroll.getEmployeeId(),
                        payroll.getBasicSalary().toString(),
                        payroll.getAllowanceAmount().toString(),
                        payroll.getDeductions().toString(),
                        payroll.getTotalAmount().toString()
                };
                csvWriter.writeNext(data);
                csvWriter.close();

                System.out.println("File saved to: " + file.getAbsolutePath());
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Payroll1> createPayroll(@RequestBody Payroll1 payroll1) {
        try {
            System.out.println("Received Payroll: " + payroll1);
            Payroll1 savedPayroll = payrollRepo1.save(payroll1);
            return ResponseEntity.ok(savedPayroll);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Payroll1>> getAllPayrolls() {
        try {
            List<Payroll1> payrolls = payrollRepo1.findAll();
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get payroll by ID
    @GetMapping("/{id}")
    public ResponseEntity<Payroll1> getPayrollById(@PathVariable Long id) {
        return payrollRepo1.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get payrolls by employee ID
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Payroll1>> getPayrollsByEmployeeId(@PathVariable String employeeId) {
        try {
            List<Payroll1> payrolls = payrollRepo1.findByEmployeeId(employeeId);
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Update payroll
    @PutMapping("/{id}")
    public ResponseEntity<Payroll1> updatePayroll(@PathVariable Long id, @RequestBody Payroll1 payroll1) {
        if (!payrollRepo1.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        payroll1.setId(id);
        Payroll1 updatedPayroll = payrollRepo1.save(payroll1);
        return ResponseEntity.ok(updatedPayroll);
    }



}

