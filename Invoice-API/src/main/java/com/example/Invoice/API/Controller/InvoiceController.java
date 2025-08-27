package com.example.Invoice.API.Controller;

import com.example.Invoice.API.Modal.Client;
import com.example.Invoice.API.Modal.Invoice;
import com.example.Invoice.API.Repository.ClientRepository;
import com.example.Invoice.API.Repository.InvoiceRepository;
import com.example.Invoice.API.Service.InvoiceValidationService;
import com.example.Invoice.API.Service.ValidationResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/invoices")
@CrossOrigin
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;
    private final ClientRepository clientRepository;
    private final InvoiceValidationService invoiceValidationService;

    @PostMapping("/validate")
    public ResponseEntity<?> validateInvoice(@RequestBody Invoice invoice) {
        ValidationResult validationResult = invoiceValidationService.validateInvoice(invoice);
        return ResponseEntity.ok(Map.of("status", validationResult, "message", getValidationMessage(validationResult)));
    }

    @PostMapping("/add")
    public ResponseEntity<?> createInvoice(@RequestBody Invoice invoice, @RequestParam(defaultValue = "false") boolean force) {
        if (!force) {
            ValidationResult validationResult = invoiceValidationService.validateInvoice(invoice);
            if (validationResult != ValidationResult.VALID) {
                return ResponseEntity.status(409).body(Map.of("status", validationResult, "message", getValidationMessage(validationResult)));
            }
        }

        Long clientId = invoice.getClient().getId();
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + clientId));

        invoice.setClient(client);
        invoice.setSuspicious(invoiceValidationService.validateInvoice(invoice) == ValidationResult.SUSPICIOUS_INVOICE);

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return ResponseEntity.ok(savedInvoice);
    }

    private String getValidationMessage(ValidationResult result) {
        if (result == null) return "";
        switch (result) {
            case DUPLICATE_INVOICE:
                return "Duplicate Invoice: An invoice already exists for this client with the same amount on the same date.";
            case SUSPICIOUS_INVOICE:
                return "Suspicious Invoice: The invoice amount exceeds 100,000 or the quantity is greater than 100.";
            default:
                return "";
        }
    }

    @GetMapping("/all")
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id) {
        return invoiceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvoice(@PathVariable Long id) {
        return invoiceRepository.findById(id).map(invoice -> {
            invoiceRepository.delete(invoice);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Invoice> searchInvoices(@RequestParam String query) {
        return invoiceRepository.findByInvoiceNumberContainingIgnoreCase(query);
    }
}
