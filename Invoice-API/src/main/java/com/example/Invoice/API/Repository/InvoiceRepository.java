package com.example.Invoice.API.Repository;

import com.example.Invoice.API.Modal.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByClientId(Long clientId);
    List<Invoice> findByInvoiceNumberContainingIgnoreCase(String keyword);
}
