package com.example.Invoice.API.Service;

import com.example.Invoice.API.Modal.Invoice;
import com.example.Invoice.API.Repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceValidationService {

    private final InvoiceRepository invoiceRepository;

    private static final double SUSPICIOUS_AMOUNT_THRESHOLD = 100000;
    private static final int SUSPICIOUS_QUANTITY_THRESHOLD = 100;

    public ValidationResult validateInvoice(Invoice invoice) {
        if (isSuspicious(invoice)) {
            return ValidationResult.SUSPICIOUS_INVOICE;
        }
        if (isDuplicate(invoice)) {
            return ValidationResult.DUPLICATE_INVOICE;
        }
        return ValidationResult.VALID;
    }

    private boolean isSuspicious(Invoice invoice) {
        return invoice.getTotal() > SUSPICIOUS_AMOUNT_THRESHOLD || invoice.getQuantity() > SUSPICIOUS_QUANTITY_THRESHOLD;
    }

    private boolean isDuplicate(Invoice invoice) {
        List<Invoice> duplicates = invoiceRepository.findByClientIdAndTotalAndDate(
                invoice.getClient().getId(),
                invoice.getTotal(),
                invoice.getDate()
        );
        return !duplicates.isEmpty();
    }
}
