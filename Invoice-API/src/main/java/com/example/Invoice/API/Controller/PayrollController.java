//package com.example.Invoice.API.Controller;
//
//// Required imports for PayrollController
//import com.example.Invoice.API.Modal.Payroll;
//import com.example.Invoice.API.Repository.PayrollRepo;
//import com.itextpdf.text.*;
//import com.itextpdf.text.pdf.PdfPCell;
//import com.itextpdf.text.pdf.PdfPTable;
//import com.itextpdf.text.pdf.PdfWriter;
//import com.opencsv.CSVWriter;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ContentDisposition;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.io.ByteArrayOutputStream;
//import java.io.File;
//import java.io.FileWriter;
//import java.math.BigDecimal;
//import java.text.DecimalFormat;
//import java.text.NumberFormat;
//import java.text.SimpleDateFormat;
//import java.util.Date;
//import java.util.List;
//import java.util.Locale;
//
//
//@RestController
//@RequestMapping("/api/payroll")
//@CrossOrigin(origins = "http://localhost:4200")
//public class PayrollController {
//    @Autowired
//    private PayrollRepo payrollRepo;
//
//    private static final String CSV_DOWNLOAD_PATH = "C:/Users/nithya prashanth/Desktop/images/Invoice";
//
//    // Existing code...
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deletePayroll(@PathVariable Long id) {
//        try {
//            if (!payrollRepo.existsById(id)) {
//                return ResponseEntity.notFound().build();
//            }
//            payrollRepo.deleteById(id);
//            return ResponseEntity.ok().build();
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }
//
//    @GetMapping("/generate-pdf/{id}")
//    public ResponseEntity<byte[]> generatePDF(@PathVariable Long id) {
//        try {
//            Payroll payroll = payrollRepo.findById(id)
//                    .orElseThrow(() -> new RuntimeException("Payroll not found"));
//
//            Document document = new Document(PageSize.A4);
//            ByteArrayOutputStream baos = new ByteArrayOutputStream();
//            PdfWriter.getInstance(document, baos);
//
//            document.open();
//
//            // Add company header
//            Paragraph header = new Paragraph("JUPITER KING TECHNOLOGIES", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18));
//            header.setAlignment(Element.ALIGN_CENTER);
//            document.add(header);
//
//            // Add company details
//            Paragraph companyDetails = new Paragraph(
//                    "Address: Nrupathunga Road, Kuvempunagar, Mysore\n" +
//                            "Phone: 91+ 7259489277\n" +
//                            "Email: jupiterkingtechnologies@gmail.com\n",
//                    FontFactory.getFont(FontFactory.HELVETICA, 12)
//            );
//            companyDetails.setAlignment(Element.ALIGN_CENTER);
//            document.add(companyDetails);
//
//            document.add(new Paragraph("\n")); // Add space after company details
//
//            // Add invoice title
//            Paragraph invoiceTitle = new Paragraph("Payroll Invoice", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16));
//            invoiceTitle.setAlignment(Element.ALIGN_CENTER);
//            document.add(invoiceTitle);
//
//            document.add(new Paragraph("\n")); // Add space after title
//
//            // Add invoice details
//            document.add(new Paragraph("Invoice Number: " + payroll.getInvoiceNumber()));
//            document.add(new Paragraph("Date: " + new Date()));
//
//            document.add(new Paragraph("\nEmployee Details:"));
//            document.add(new Paragraph("Name: " + payroll.getEmployeeName()));
//            document.add(new Paragraph("Employee ID: " + payroll.getEmployeeId()));
//
//            document.add(new Paragraph("\nSalary Breakdown:"));
//
//            // Create a table for salary breakdown
//            PdfPTable table = new PdfPTable(2); // 2 columns
//            table.setWidthPercentage(100); // Full width
//            table.setSpacingBefore(10f);
//            table.setSpacingAfter(10f);
//
//            // Add table header
//            PdfPCell cell1 = new PdfPCell(new Phrase("Description", FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
//            PdfPCell cell2 = new PdfPCell(new Phrase("Amount ($)", FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
//            cell1.setHorizontalAlignment(Element.ALIGN_CENTER);
//            cell2.setHorizontalAlignment(Element.ALIGN_CENTER);
//            table.addCell(cell1);
//            table.addCell(cell2);
//
//            // Add table rows
//            table.addCell("Basic Salary");
//            table.addCell(String.valueOf(payroll.getBasicSalary()));
//            table.addCell("Allowance");
//            table.addCell(String.valueOf(payroll.getAllowanceAmount()));
//            table.addCell("Deductions");
//            table.addCell(String.valueOf(payroll.getDeductions()));
//            table.addCell("Total Amount");
//            table.addCell(String.valueOf(payroll.getTotalAmount()));
//
//            document.add(table);
//
//            document.close();
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_PDF);
//            headers.setContentDisposition(ContentDisposition.builder("attachment")
//                    .filename("payroll_" + payroll.getInvoiceNumber() + ".pdf").build());
//
//            return ResponseEntity.ok()
//                    .headers(headers)
//                    .body(baos.toByteArray());
//
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }
//
//
//
//
//    // Helper methods
//    private void addTableCell(PdfPTable table, String label, String value) {
//        PdfPCell labelCell = new PdfPCell(new Phrase(label, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
//        labelCell.setBorder(Rectangle.NO_BORDER);
//        table.addCell(labelCell);
//
//        PdfPCell valueCell = new PdfPCell(new Phrase(value, FontFactory.getFont(FontFactory.HELVETICA, 11)));
//        valueCell.setBorder(Rectangle.NO_BORDER);
//        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
//        table.addCell(valueCell);
//    }
//
//    private void addEmptyRow(PdfPTable table) {
//        PdfPCell emptyCell = new PdfPCell(new Phrase(" "));
//        emptyCell.setBorder(Rectangle.NO_BORDER);
//        table.addCell(emptyCell);
//        table.addCell(emptyCell);
//    }
//
//    private String formatCurrency(BigDecimal amount) {
//        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "US"));
//        DecimalFormat decimalFormat = (DecimalFormat) currencyFormat;
//        decimalFormat.setMinimumFractionDigits(2);
//        decimalFormat.setMaximumFractionDigits(2);
//        return currencyFormat.format(amount);
//    }
//
//
//
//
//
//    @GetMapping("/download-csv/{id}")
//    public ResponseEntity<Void> downloadCSV(@PathVariable Long id) {
//        try {
//            Payroll payroll = payrollRepo.findById(id)
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
//                // Write headers
//                String[] headers = {"Invoice Number", "Employee Name", "Employee ID", "Basic Salary",
//                        "Allowance", "Deductions", "Total Amount"};
//                csvWriter.writeNext(headers);
//
//                // Write data
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
//
//
//
//
//
//    @PostMapping
//    public ResponseEntity<Payroll> createPayroll(@RequestBody Payroll payroll) {
//        try {
//            System.out.println("Received Payroll: " + payroll); // Log the received payroll
//            Payroll savedPayroll = payrollRepo.save(payroll);
//            return ResponseEntity.ok(savedPayroll);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().build();
//        }
//    }
//
//
//    // Get all payroll entries
//    @GetMapping
//    public ResponseEntity<List<Payroll>> getAllPayrolls() {
//        try {
//            List<Payroll> payrolls = payrollRepo.findAll();
//            return ResponseEntity.ok(payrolls);
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }
//
//    // Get payroll by ID
//    @GetMapping("/{id}")
//    public ResponseEntity<Payroll> getPayrollById(@PathVariable Long id) {
//        return payrollRepo.findById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    // Get payrolls by employee ID
//    @GetMapping("/employee/{employeeId}")
//    public ResponseEntity<List<Payroll>> getPayrollsByEmployeeId(@PathVariable String employeeId) {
//        try {
//            List<Payroll> payrolls = payrollRepo.findByEmployeeId(employeeId);
//            return ResponseEntity.ok(payrolls);
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }
//
//    // Update payroll
//    @PutMapping("/{id}")
//    public ResponseEntity<Payroll> updatePayroll(@PathVariable Long id, @RequestBody Payroll payroll) {
//        if (!payrollRepo.existsById(id)) {
//            return ResponseEntity.notFound().build();
//        }
//        payroll.setId(id);
//        Payroll updatedPayroll = payrollRepo.save(payroll);
//        return ResponseEntity.ok(updatedPayroll);
//    }
//
//
//
//}
