package com.example.Invoice.API.Controller;

import com.example.Invoice.API.Modal.Expense;
import com.example.Invoice.API.Repository.ExpenseRepository;

import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.io.File;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;

import com.itextpdf.text.log.Logger;
import com.itextpdf.text.log.LoggerFactory;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;


@RestController
@RequestMapping("/api/expenses1")
@CrossOrigin(origins = "http://localhost:4200")
public class ExpenseController {
    @Autowired
    private ExpenseRepository expenseRepository; // Directly use repository for DB operations


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
    private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);
    private static final String BASE_DIR = Paths.get(System.getProperty("user.home"), "ExpenseInvoices").toString();

   

    @PostConstruct
    public void init() {
        try {
            // Print to both console and logger
            System.out.println("Starting directory initialization...");
            System.out.println("Base directory path: " + BASE_DIR);
            logger.info("Starting directory initialization...");
            logger.info("Base directory path: " + BASE_DIR);

            // Ensure the base directory exists
            File baseDir = new File(BASE_DIR);
            if (!baseDir.exists()) {
                boolean created = baseDir.mkdirs();
                if (created) {
                    System.out.println("Successfully created base directory at: " + BASE_DIR);
                    logger.info("Successfully created base directory at: " + BASE_DIR);
                } else {
                    System.err.println("Failed to create base directory at: " + BASE_DIR);
                    logger.error("Failed to create base directory at: " + BASE_DIR);
                }
            } else {
                System.out.println("Directory already exists at: " + BASE_DIR);
                logger.info("Directory already exists at: " + BASE_DIR);
            }

            // Verify directory is writable
            if (baseDir.canWrite()) {
                System.out.println("Directory is writable: " + BASE_DIR);
                logger.info("Directory is writable: " + BASE_DIR);
            } else {
                System.err.println("WARNING: Directory is not writable: " + BASE_DIR);
                logger.warn("Directory is not writable: " + BASE_DIR);
            }

        } catch (Exception e) {
            System.err.println("Error during directory initialization: " + e.getMessage());
            logger.error("Error during directory initialization: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @PostMapping("/download-csv")
    public ResponseEntity<?> downloadCSV(@RequestBody Map<String, String> request) {
        try {
            String csvContent = request.get("content");
            String invoiceNumber = request.get("invoiceNumber");

            // Log the attempt to create CSV
            System.out.println("Attempting to create CSV for invoice: " + invoiceNumber);
            logger.info("Attempting to create CSV for invoice: " + invoiceNumber);

            // Create directory if it doesn't exist
            File directory = new File(BASE_DIR);
            if (!directory.exists()) {
                boolean created = directory.mkdirs();
                System.out.println("Creating directory result: " + created);
                logger.info("Creating directory result: " + created);
            }

            // Generate filename with timestamp
            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String filename = String.format("expense_%s_%s.csv", invoiceNumber, timestamp);
            Path filePath = Paths.get(BASE_DIR, filename);

            // Log the file path
            System.out.println("Attempting to save CSV file at: " + filePath);
            logger.info("Attempting to save CSV file at: " + filePath);

            // Write content to file
            Files.write(filePath, csvContent.getBytes(StandardCharsets.UTF_8));

            // Read the file and prepare it for download
            byte[] fileContent = Files.readAllBytes(filePath);

            // Set response headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDisposition(ContentDisposition.attachment().filename(filename).build());
            headers.setContentLength(fileContent.length);

            System.out.println("CSV file successfully created and ready for download: " + filename);
            logger.info("CSV file successfully created and ready for download: " + filename);

            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);

        } catch (Exception e) {
            String errorMsg = "Error processing CSV file: " + e.getMessage();
            System.err.println(errorMsg);
            logger.error(errorMsg);
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", errorMsg));
        }
    }



    //    C:\Users/username\ExpenseInvoices
//    private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);
//    private static final String BASE_DIR = Paths.get(System.getProperty("user.home"), "ExpenseInvoices").toString();
//
//
//
//    @PostConstruct
//    public void init() {
//        // Ensure the base directory exists
//        File baseDir = new File(BASE_DIR);
//        if (!baseDir.exists()) {
//            boolean created = baseDir.mkdirs();
//            if (created) {
//                // Fix logging statement
//                logger.info("Created base directory: " + BASE_DIR);
//                System.out.println("Created base directory: " + BASE_DIR);
//            } else {
//                // Fix logging statement
//                logger.error("Failed to create base directory: " + BASE_DIR);
//            }
//        }
//    }
//
//    @PostMapping("/download-csv")
//    public ResponseEntity<?> downloadCSV(@RequestBody Map<String, String> request) {
//        try {
//            String csvContent = request.get("content");
//            String invoiceNumber = request.get("invoiceNumber");
//
//            // Create directory if it doesn't exist
//            File directory = new File(BASE_DIR);
//            if (!directory.exists()) {
//                directory.mkdirs();
//            }
//
//            // Generate filename with timestamp
//            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
//            String filename = String.format("expense_%s_%s.csv", invoiceNumber, timestamp);
//            Path filePath = Paths.get(BASE_DIR, filename);
//
//            // Write content to file
//            Files.write(filePath, csvContent.getBytes(StandardCharsets.UTF_8));
//
//            // Read the file and prepare it for download
//            byte[] fileContent = Files.readAllBytes(filePath);
//
//            // Set response headers
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.parseMediaType("text/csv"));
//            headers.setContentDisposition(ContentDisposition.attachment().filename(filename).build());
//            headers.setContentLength(fileContent.length);
//
//            // Fix logging statement
//            logger.info("CSV file saved successfully at: " + filePath.toString());
//
//            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
//
//        } catch (Exception e) {
//            // Fix logging statement
//            logger.error("Error processing CSV file: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of(
//                            "error", "Failed to process CSV file: " + e.getMessage()
//                    ));
//        }
//    }
}
//
//    private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);
//    private static final String csvDownloadPath = "C:/Users/nithya prashanth/Desktop/images/Expense-Invoice";
////private static final String BASE_DIR = Paths.get(System.getProperty("user.home"), "ExpenseInvoices").toString();
////
////    @PostConstruct
////    public void init() {
////        // Ensure the base directory exists
////        File baseDir = new File(BASE_DIR);
////        if (!baseDir.exists()) {
////            boolean created = baseDir.mkdirs();
////            if (created) {
////                System.out.println("Created base directory: " + BASE_DIR);
////            } else {
////                System.err.println("Failed to create base directory: " + BASE_DIR);
////            }
////        }
////    }
//
//
//    @PostMapping("/download-csv")
//    public ResponseEntity<?> downloadCSV(@RequestBody Map<String, String> request) {
//        try {
//            String csvContent = request.get("content");
//            String invoiceNumber = request.get("invoiceNumber");
//
//            // Create directory if it doesn't exist
//            File directory = new File(csvDownloadPath );
//            if (!directory.exists()) {
//                directory.mkdirs();
//            }
//
//            // Generate filename with timestamp
//            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
//            String filename = String.format("expense_%s_%s.csv", invoiceNumber, timestamp);
//            Path filePath = Paths.get(csvDownloadPath , filename);
//
//            // Write content to file
//            Files.write(filePath, csvContent.getBytes(StandardCharsets.UTF_8));
//
//            // Read the file and prepare it for download
//            byte[] fileContent = Files.readAllBytes(filePath);
//
//            // Set response headers
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.parseMediaType("text/csv"));
//            headers.setContentDisposition(ContentDisposition.attachment().filename(filename).build());
//            headers.setContentLength(fileContent.length);
//
//            // Simple logging without placeholders
//            logger.info("CSV file saved successfully at: " + filePath.toString());
//
//            // Return both the file content for download and the saved file path
//            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
//
//        } catch (Exception e) {
//            // Simple logging without placeholders
//            logger.error("Error processing CSV file: " + e.getMessage());
//            return new ResponseEntity<>(Map.of(
//                    "error", "Failed to process CSV file: " + e.getMessage()
//            ), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//}









//    // Common base directory for all CSV files
//    private static final String BASE_DIR = Paths.get(System.getProperty("user.home"), "ExpenseInvoices").toString();
//
//    @PostConstruct
//    public void init() {
//        // Ensure the base directory exists
//        File baseDir = new File(BASE_DIR);
//        if (!baseDir.exists()) {
//            boolean created = baseDir.mkdirs();
//            if (created) {
//                System.out.println("Created base directory: " + BASE_DIR);
//            } else {
//                System.err.println("Failed to create base directory: " + BASE_DIR);
//            }
//        }
//    }
//
//    @PostMapping
//    public ResponseEntity<?> createExpense(@RequestBody @Valid Expense expense) {
//        try {
//            expense.prePersist();
//            Expense savedExpense = expenseRepository.save(expense);
//            return ResponseEntity.status(HttpStatus.CREATED).body(savedExpense);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("message", "Failed to create expense", "error", e.getMessage()));
//        }
//    }
//
//    @GetMapping
//    public ResponseEntity<List<Expense>> getAllExpenses() {
//        List<Expense> expenses = expenseRepository.findAll();
//        return ResponseEntity.ok(expenses);
//    }
//
////    @PostMapping("/download-csv/{id}")
//    @PostMapping("/download-csv/{id}")
//    public ResponseEntity<Void> downloadCSV(@PathVariable Long id) {
//        try {
//            Expense expense = expenseRepository.findById(id)
//                    .orElseThrow(() -> new RuntimeException("Expense not found"));
//
//            // Directory for saving CSV files
//            File directory = new File(BASE_DIR);
//            if (!directory.exists()) {
//                directory.mkdirs();
//            }
//
//            // Generate filename with invoice number and timestamp
//            String fileName = String.format("expense_%s_%s.csv",
//                    expense.getInvoiceNumber(),
//                    new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date()));
//            File file = new File(directory, fileName);
//
//            // Write CSV content
//            try (FileWriter writer = new FileWriter(file)) {
//                CSVWriter csvWriter = new CSVWriter(writer);
//
//                String[] headers = {"Invoice Number", "Description", "Amount", "Date"};
//                csvWriter.writeNext(headers);
//
//                String[] data = {
//                        expense.getInvoiceNumber(),
//                        expense.getExpenseDescription(),
//                        expense.getExpenseAmount().toString(),
//                        expense.getExpenseDate().toString()
//                };
//                csvWriter.writeNext(data);
//                csvWriter.close();
//
//                System.out.println("CSV file saved to: " + file.getAbsolutePath());
//                return ResponseEntity.ok().build();
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
//        try {
//            if (!expenseRepository.existsById(id)) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                        .body(Map.of("message", "Expense not found with id: " + id));
//            }
//            expenseRepository.deleteById(id);
//            return ResponseEntity.ok(Map.of("message", "Expense deleted successfully"));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("message", "Failed to delete expense", "error", e.getMessage()));
//        }
//    }
//}
//
//
//
