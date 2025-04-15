package com.example.Invoice.API.Controller;

import com.example.Invoice.API.Modal.Expensetype;
import com.example.Invoice.API.Repository.ExpenseTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expense-types")
public class ExpenseTypeController {

    @Autowired
    private ExpenseTypeRepository expenseTypeRepository;

    @GetMapping("/all")
    public List<Expensetype> getAllExpenseTypes() {
        return expenseTypeRepository.findAll();
    }

    @PostMapping("/Create")
    public Expensetype createExpenseType(@RequestBody Expensetype expenseType) {
        return expenseTypeRepository.save(expenseType);
    }

    @GetMapping("/{id}")
    public Expensetype getExpenseTypeById(@PathVariable Long id) {
        return expenseTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExpenseType not found with id: " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteExpenseType(@PathVariable Long id) {
        expenseTypeRepository.deleteById(id);
    }
}

