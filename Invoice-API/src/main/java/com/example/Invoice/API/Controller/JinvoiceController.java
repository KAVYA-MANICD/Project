package com.example.Invoice.API.Controller;

import com.example.Invoice.API.Modal.Jupiterinvoice;
//import com.example.Invoice.API.Repository.JinvoiceRepo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:4200")
public class JinvoiceController {
//    @PersistenceContext
    private EntityManager entityManager;

//@Autowired
//    JinvoiceRepo jinvoiceRepo;

    @PostMapping
//    @Transactional



    public ResponseEntity<?> createExpense(@RequestBody Jupiterinvoice jupiterinvoice) {
        try {
            entityManager.persist(jupiterinvoice);
            return ResponseEntity.ok().body(jupiterinvoice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating expense: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Jupiterinvoice>> getAllExpenses() {
        List<Jupiterinvoice> expenses = entityManager
                .createQuery("SELECT e FROM Expense e ORDER BY e.date DESC", Jupiterinvoice.class)
                .getResultList();
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Jupiterinvoice> getExpenseById(@PathVariable Long id) {
        Jupiterinvoice expense = entityManager.find(Jupiterinvoice.class, id);
        if (expense != null) {
            return ResponseEntity.ok(expense);
        }
        return ResponseEntity.notFound().build();
    }

}
