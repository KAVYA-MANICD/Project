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

        // Basic Metrics
        double totalRevenue = invoices.stream().mapToDouble(i -> i.getTotal() == null ? 0.0 : i.getTotal()).sum();
        int totalInvoices = invoices.size();
        double averageInvoiceValue = totalInvoices == 0 ? 0.0 : totalRevenue / totalInvoices;
        double highestInvoiceValue = invoices.stream().mapToDouble(i -> i.getTotal() == null ? 0.0 : i.getTotal()).max().orElse(0.0);
        double lowestInvoiceValue = invoices.stream().mapToDouble(i -> i.getTotal() == null ? 0.0 : i.getTotal()).min().orElse(0.0);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");

        // Invoices by Month
        Map<String, Long> invoicesPerMonthMap = invoices.stream()
                .filter(i -> i.getDate() != null)
                .collect(Collectors.groupingBy(i -> i.getDate().format(fmt), Collectors.counting()));
        List<Map<String, Object>> invoicesPerMonth = mapToList(invoicesPerMonthMap, "month", "count");

        // Revenue by Month
        Map<String, Double> revenuePerMonthMap = invoices.stream()
                .filter(i -> i.getDate() != null)
                .collect(Collectors.groupingBy(i -> i.getDate().format(fmt), Collectors.summingDouble(i -> i.getTotal() == null ? 0.0 : i.getTotal())));
        List<Map<String, Object>> revenuePerMonth = mapToList(revenuePerMonthMap, "month", "revenue");

        // Average Invoice Value Trend by Month
        Map<String, Double> avgValuePerMonthMap = invoices.stream()
                .filter(i -> i.getDate() != null)
                .collect(Collectors.groupingBy(i -> i.getDate().format(fmt), Collectors.averagingDouble(i -> i.getTotal() == null ? 0.0 : i.getTotal())));
        List<Map<String, Object>> avgInvoiceValuePerMonth = mapToList(avgValuePerMonthMap, "month", "value");

        // Invoices by Client
        Map<String, Long> invoicesByClientMap = invoices.stream()
                .filter(i -> i.getClientName() != null && !i.getClientName().isEmpty())
                .collect(Collectors.groupingBy(Invoice::getClientName, Collectors.counting()));
        List<Map<String, Object>> invoicesByClient = mapToList(invoicesByClientMap, "client", "count");

        // Invoices by Product/Service (assuming product is in invoice description)
        Map<String, Long> invoicesByProductMap = invoices.stream()
                .filter(i -> i.getDescription() != null && !i.getDescription().isEmpty())
                .collect(Collectors.groupingBy(Invoice::getDescription, Collectors.counting()));
        List<Map<String, Object>> invoicesByProduct = mapToList(invoicesByProductMap, "product", "count");


        Map<String, Object> result = new HashMap<>();
        result.put("totalInvoices", totalInvoices);
        result.put("totalRevenue", totalRevenue);
        result.put("averageInvoiceValue", averageInvoiceValue);
        result.put("highestInvoiceValue", highestInvoiceValue);
        result.put("lowestInvoiceValue", lowestInvoiceValue);
        result.put("invoicesPerMonth", invoicesPerMonth);
        result.put("revenuePerMonth", revenuePerMonth);
        result.put("avgInvoiceValuePerMonth", avgInvoiceValuePerMonth);
        result.put("invoicesByClient", invoicesByClient);
        result.put("invoicesByProduct", invoicesByProduct);

        return ResponseEntity.ok(result);
    }

    private <K, V> List<Map<String, Object>> mapToList(Map<K, V> map, String keyName, String valueName) {
        return map.entrySet().stream()
                .sorted(Map.Entry.comparingByKey(Comparator.comparing(String::valueOf)))
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put(keyName, e.getKey());
                    m.put(valueName, e.getValue());
                    return m;
                }).collect(Collectors.toList());
    }
}
