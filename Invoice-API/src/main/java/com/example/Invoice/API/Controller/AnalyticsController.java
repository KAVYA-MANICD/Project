package com.example.Invoice.API.Controller;

import com.example.Invoice.API.Modal.Invoice;
import com.example.Invoice.API.Repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/analytics")
@CrossOrigin
@RequiredArgsConstructor
public class AnalyticsController {

    private final InvoiceRepository invoiceRepository;

    @GetMapping("/overview")
    public ResponseEntity<?> getOverview() {
        List<Invoice> invoices = invoiceRepository.findAll();

        double totalRevenue = invoices.stream().mapToDouble(i -> i.getTotal() == null ? 0.0 : i.getTotal()).sum();
        int totalInvoices = invoices.size();
        double average = totalInvoices == 0 ? 0.0 : totalRevenue / totalInvoices;

        // invoices per month
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        Map<String, Long> perMonth = invoices.stream()
                .filter(i -> i.getDate() != null)
                .collect(Collectors.groupingBy(i -> i.getDate().format(fmt), Collectors.counting()));

        List<Map<String, Object>> invoicesPerMonth = perMonth.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("month", e.getKey());
                    m.put("count", e.getValue());
                    return m;
                }).collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue", totalRevenue);
        result.put("totalInvoices", totalInvoices);
        result.put("averageInvoiceValue", average);
        result.put("invoicesPerMonth", invoicesPerMonth);

        return ResponseEntity.ok(result);
    }
}
