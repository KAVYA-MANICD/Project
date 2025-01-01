//package com.example.Invoice.API.Controller;
//
//import com.example.Invoice.API.Modal.InvoiceItem;
//import com.example.Invoice.API.Modal.PInvoice;
//import com.example.Invoice.API.Repository.PayrollRepo;
//import com.example.Invoice.API.Repository.PinvoiceRepo;
//import com.itextpdf.text.*;
//import com.itextpdf.text.pdf.PdfPTable;
//import com.itextpdf.text.pdf.PdfWriter;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.io.ByteArrayOutputStream;
//import java.io.IOException;
//import java.util.List;
//
//
//@RestController
//@RequestMapping("/api")
//@CrossOrigin(origins = "http://localhost:4200")
//public class PInvoiceController {
//    @Autowired
//    private PinvoiceRepo pinvoiceRepo;
//
//    private static final String FILE_DIRECTORY = "C:/Users/nithya prashanth/Desktop/images/Invoice";  // Directory where files will be saved
//
//    @GetMapping("/pdf")
//    public ResponseEntity<byte[]> generatePDF() throws IOException, DocumentException {
//        ByteArrayOutputStream baos = new ByteArrayOutputStream();
//        com.itextpdf.text.Document document = new com.itextpdf.text.Document(PageSize.A4);
//        PdfWriter.getInstance(document, baos);
//
//        document.open();
//        try {
//            // Get latest invoice
//            List<PInvoice> invoices = pinvoiceRepo.findAll();
//            if (invoices.isEmpty()) {
//                return ResponseEntity.notFound().build();
//            }
//            PInvoice invoice = invoices.get(invoices.size() - 1);
//
//            // Add header
//            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
//            Paragraph title = new Paragraph("INVOICE", titleFont);
//            title.setAlignment(Element.ALIGN_CENTER);
//            document.add(title);
//
//            // Add invoice number and date
//            document.add(new Paragraph("\nInvoice Number: " + invoice.getInvoiceNumber()));
//            document.add(new Paragraph("Date: " + invoice.getInvoiceDate()));
//
//            // Add company and client info
//            document.add(new Paragraph("\nFrom: " + invoice.getCompanyName()));
//            document.add(new Paragraph(invoice.getCompanyAddress()));
//            document.add(new Paragraph("\nTo: " + invoice.getClientName()));
//            document.add(new Paragraph(invoice.getClientAddress()));
//
//            // Add items table
//            PdfPTable table = new PdfPTable(4);
//            table.setWidthPercentage(100);
//            table.setSpacingBefore(20);
//
//            // Add table headers with bold font
//            Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
//            table.addCell(new Paragraph("Description", headerFont));
//            table.addCell(new Paragraph("Price", headerFont));
//            table.addCell(new Paragraph("Quantity", headerFont));
//            table.addCell(new Paragraph("Total", headerFont));
//
//            for (InvoiceItem item : invoice.getItems()) {
//                table.addCell(item.getDescription());
//                table.addCell(String.format("$%.2f", item.getPrice()));
//                table.addCell(item.getQuantity().toString());
//                table.addCell(String.format("$%.2f", item.getPrice() * item.getQuantity()));
//            }
//
//            document.add(table);
//
//            // Add totals with bold font
//            Font totalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
//            Paragraph total = new Paragraph(String.format("\nTotal: $%.2f", invoice.getTotal()), totalFont);
//            total.setAlignment(Element.ALIGN_RIGHT);
//            document.add(total);
//
//        } finally {
//            document.close();
//        }
//
//        // Save the generated PDF to disk
//        String fileName = "invoice_" + invoice.getInvoiceNumber() + ".pdf";
//        File file = new File(FILE_DIRECTORY + fileName);
//        try (FileOutputStream fos = new FileOutputStream(file)) {
//            baos.writeTo(fos);
//        }
//
//        // Prepare the response
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_PDF);
//        headers.setContentDisposition(ContentDisposition.attachment().filename(fileName).build());
//
//        return ResponseEntity.ok()
//                .headers(headers)
//                .body(baos.toByteArray());
//    }
//
//    @GetMapping("/csv")
//    public ResponseEntity<byte[]> generateCSV() throws IOException {
//        List<Invoice> invoices = invoiceRepo.findAll();
//        if (invoices.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//
//        ByteArrayOutputStream baos = new ByteArrayOutputStream();
//        PrintWriter pw = new PrintWriter(baos);
//
//        try {
//            // Write header
//            pw.println("Invoice Number,Company,Client,Date,Total");
//
//            // Write data
//            for (Invoice invoice : invoices) {
//                pw.printf("%s,%s,%s,%s,%.2f\n",
//                        invoice.getInvoiceNumber(),
//                        invoice.getCompanyName(),
//                        invoice.getClientName(),
//                        invoice.getInvoiceDate(),
//                        invoice.getTotal()
//                );
//            }
//        } finally {
//            pw.close();
//        }
//
//        // Save the generated CSV to disk
//        String fileName = "invoices.csv";
//        File file = new File(FILE_DIRECTORY + fileName);
//        try (FileOutputStream fos = new FileOutputStream(file)) {
//            baos.writeTo(fos);
//        }
//
//        // Prepare the response
//        HttpHeaders headers = new HttpHeaders();
//        // Use custom media type for CSV
//        MediaType csvMediaType = new MediaType("text", "csv");
//        headers.setContentType(csvMediaType);
//        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);
//
//        return ResponseEntity.ok()
//                .headers(headers)
//                .body(baos.toByteArray());
//    }
//
//}
//
//
