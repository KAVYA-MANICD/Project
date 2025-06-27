package com.example.Invoice.API.Controller;

import com.example.Invoice.API.Modal.Client;
import com.example.Invoice.API.Modal.Invoice;
import com.example.Invoice.API.Repository.ClientRepository;
import com.example.Invoice.API.Repository.InvoiceRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoices")
@CrossOrigin
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;
    private final ClientRepository clientRepository;

    // Create Invoice
    @PostMapping("/add")
    public ResponseEntity<?> createInvoice(@RequestBody Invoice invoice) {
        Long clientId = invoice.getClient().getId();
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + clientId));

        invoice.setClient(client); // Attach managed entity
        Invoice savedInvoice = invoiceRepository.save(invoice);
        return ResponseEntity.ok(savedInvoice);
    }

    // Get all invoices
    @GetMapping("/all")
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    // Get invoice by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getInvoiceById(@PathVariable Long id) {
        return invoiceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete invoice
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvoice(@PathVariable Long id) {
        return invoiceRepository.findById(id).map(invoice -> {
            invoiceRepository.delete(invoice);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Optional: Search by invoice number
    @GetMapping("/search")
    public List<Invoice> searchInvoices(@RequestParam String query) {
        return invoiceRepository.findByInvoiceNumberContainingIgnoreCase(query);
    }
}

