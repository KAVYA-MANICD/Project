package com.example.Invoice.API.Controller;

import com.example.Invoice.API.Modal.Expensetype;
import com.example.Invoice.API.Repository.ExpenseTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expense-types")
@CrossOrigin
public class ExpenseTypeController {

    @Autowired
    private ExpenseTypeRepository expenseTypeRepository;

    @GetMapping("/all")
    public List<Expensetype> getAllExpenseTypes() {
        return expenseTypeRepository.findAll();
    }

    @PostMapping("/Create")
    public ResponseEntity<?> createExpenseType(@RequestBody Expensetype expenseType) {
        // Validate if expenseType is null
        if (expenseType == null || expenseType.getExpenseType() == null || expenseType.getExpenseType().isEmpty()) {
            return ResponseEntity.badRequest().body("Expense Type cannot be empty.");
        }

        try {
            // Saving the expense type
            Expensetype savedExpenseType = expenseTypeRepository.save(expenseType);

            // Returning a response with the saved object
            return ResponseEntity.status(HttpStatus.CREATED).body(savedExpenseType);
        } catch (Exception e) {
            // Logging the error and returning a bad request response
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving the expense type.");
        }
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

