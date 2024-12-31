package com.example.Invoice.API.Controller;

import com.example.Invoice.API.Modal.Invoice;
import com.example.Invoice.API.Modal.InvoiceItem;
import com.example.Invoice.API.Repository.InvoiceRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.Document;
import java.io.ByteArrayOutputStream;
import java.io.IOException;



import com.example.Invoice.API.Modal.Invoice;
import com.example.Invoice.API.Modal.InvoiceItem;
import com.example.Invoice.API.Repository.InvoiceRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;


@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:4200")
public class InvoiceController {
    @Autowired
    private InvoiceRepo invoiceRepo;

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice) {
        Invoice savedInvoice = invoiceRepo.save(invoice);
        return ResponseEntity.ok(savedInvoice);
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> generatePDF() throws IOException, DocumentException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        com.itextpdf.text.Document document = new com.itextpdf.text.Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);

        document.open();
        try {
            // Get latest invoice
            List<Invoice> invoices = invoiceRepo.findAll();
            if (invoices.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Invoice invoice = invoices.get(invoices.size() - 1);

            // Add header
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("INVOICE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            // Add invoice number and date
            document.add(new Paragraph("\nInvoice Number: " + invoice.getInvoiceNumber()));
            document.add(new Paragraph("Date: " + invoice.getInvoiceDate()));

            // Add company and client info
            document.add(new Paragraph("\nFrom: " + invoice.getCompanyName()));
            document.add(new Paragraph(invoice.getCompanyAddress()));
            document.add(new Paragraph("\nTo: " + invoice.getClientName()));
            document.add(new Paragraph(invoice.getClientAddress()));

            // Add items table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setSpacingBefore(20);

            // Add table headers with bold font
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            table.addCell(new Paragraph("Description", headerFont));
            table.addCell(new Paragraph("Price", headerFont));
            table.addCell(new Paragraph("Quantity", headerFont));
            table.addCell(new Paragraph("Total", headerFont));

            for (InvoiceItem item : invoice.getItems()) {
                table.addCell(item.getDescription());
                table.addCell(String.format("$%.2f", item.getPrice()));
                table.addCell(item.getQuantity().toString());
                table.addCell(String.format("$%.2f", item.getPrice() * item.getQuantity()));
            }

            document.add(table);

            // Add totals with bold font
            Font totalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            Paragraph total = new Paragraph(String.format("\nTotal: $%.2f", invoice.getTotal()), totalFont);
            total.setAlignment(Element.ALIGN_RIGHT);
            document.add(total);

        } finally {
            document.close();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename("invoice.pdf").build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(baos.toByteArray());
    }

    @GetMapping("/csv")
    public ResponseEntity<byte[]> generateCSV() throws IOException {
        List<Invoice> invoices = invoiceRepo.findAll();
        if (invoices.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintWriter pw = new PrintWriter(baos);

        try {
            // Write header
            pw.println("Invoice Number,Company,Client,Date,Total");

            // Write data
            for (Invoice invoice : invoices) {
                pw.printf("%s,%s,%s,%s,%.2f\n",
                        invoice.getInvoiceNumber(),
                        invoice.getCompanyName(),
                        invoice.getClientName(),
                        invoice.getInvoiceDate(),
                        invoice.getTotal()
                );
            }
        } finally {
            pw.close();
        }

        HttpHeaders headers = new HttpHeaders();
        // Use custom media type for CSV
        MediaType csvMediaType = new MediaType("text", "csv");
        headers.setContentType(csvMediaType);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoices.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(baos.toByteArray());
    }
}