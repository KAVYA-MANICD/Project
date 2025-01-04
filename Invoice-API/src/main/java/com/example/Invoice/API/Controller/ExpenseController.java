package com.example.Invoice.API.Controller;

import com.example.Invoice.API.Modal.Expense;
import com.example.Invoice.API.Repository.ExpenseRepository;
import com.itextpdf.text.log.Logger;
import com.itextpdf.text.log.LoggerFactory;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses1")
@CrossOrigin(origins = "http://localhost:4200")
public class ExpenseController {
    @Autowired
    private ExpenseRepository expenseRepository; // Directly use repository for DB operations

    // Create Expense endpoint
//    @PostMapping
//    public ResponseEntity<?> createExpense(@RequestBody @Valid Expense expense) {
//        try {
//            // Save the expense data to the database
//            Expense savedExpense = expenseRepository.save(expense);
//
//            // Return a success response
//            return ResponseEntity.status(HttpStatus.CREATED)
//                    .body(Map.of("message", "Expense created successfully!", "expense", savedExpense));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("message", "Failed to create expense", "error", e.getMessage()));
//        }
//    }

    // Optionally, you can define a GET method to fetch all expenses (if required)
//    @GetMapping
//    public ResponseEntity<List<Expense>> getAllExpenses() {
//        List<Expense> expenses = expenseRepository.findAll();
//        return ResponseEntity.ok(expenses);
//    }

    @PostMapping
    public ResponseEntity<?> createExpense(@RequestBody @Valid Expense expense) {
        try {
            // Generate invoice number before saving
            expense.prePersist();

            // Save the expense data to the database
            Expense savedExpense = expenseRepository.save(expense);

            // Return the complete saved expense object
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(savedExpense);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create expense",
                            "error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        List<Expense> expenses = expenseRepository.findAll();
        // Add debug log
        System.out.println("Returning expenses: " + expenses);
        return ResponseEntity.ok(expenses);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        try {
            // Add debug log
            System.out.println("Attempting to delete expense with ID: " + id);

            if (!expenseRepository.existsById(id)) {
                System.out.println("Expense not found with ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Expense not found with id: " + id));
            }

            expenseRepository.deleteById(id);
            System.out.println("Successfully deleted expense with ID: " + id);

            return ResponseEntity.ok()
                    .body(Map.of("message", "Expense deleted successfully"));
        } catch (Exception e) {
            System.err.println("Error deleting expense: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message", "Failed to delete expense",
                            "error", e.getMessage()
                    ));
        }
    }


    private static final String csvDownloadPath = "C:/Users/nithya prashanth/Desktop/images/Invoice";
    private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);

    @PostMapping("/download-csv")
    public ResponseEntity<?> downloadCSV(@RequestBody Map<String, String> request) {
        try {
            String csvContent = request.get("content");
            String invoiceNumber = request.get("invoiceNumber");

            // Create directory if it doesn't exist
            File directory = new File(csvDownloadPath);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Create file with timestamp
            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String fileName = String.format("expense_%s_%s.csv", invoiceNumber, timestamp);
            Path filePath = Paths.get(csvDownloadPath, fileName);

            // Write content to file
            Files.write(filePath, csvContent.getBytes());

            logger.info("CSV file saved successfully at: " + filePath);

            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "CSV file saved successfully",
                            "path", filePath.toString()
                    ));

        } catch (Exception e) {
            logger.error("Error saving CSV file: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to save CSV file: " + e.getMessage()));
        }
    }
}