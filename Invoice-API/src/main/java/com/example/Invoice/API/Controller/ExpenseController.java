package com.example.Invoice.API.Controller;

import com.example.Invoice.API.Modal.Expense;
import com.example.Invoice.API.Repository.ExpenseRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.example.Invoice.API.Modal.Expense;
import com.example.Invoice.API.Modal.Payroll;
import com.example.Invoice.API.Repository.ExpenseRepository;
import com.itextpdf.text.log.Logger;
import com.itextpdf.text.log.LoggerFactory;
import jakarta.validation.Valid;

// New imports for file handling and HTTP responses
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Java utilities
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

// Spring validation and cross-origin
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Exception handling
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;


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


//    private static final String csvDownloadPath = "C:/Users/nithya prashanth/Desktop/images/Expense-Invoice";
//    private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);
//
//    @PostMapping("/download-csv")
//    public ResponseEntity<?> downloadCSV(@RequestBody Map<String, String> request) {
//        try {
//            String csvContent = request.get("content");
//            String invoiceNumber = request.get("invoiceNumber");
//
//            // Create directory if it doesn't exist
//            File directory = new File(csvDownloadPath);
//            if (!directory.exists()) {
//                directory.mkdirs();
//            }
//
//            // Create file with timestamp
//            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
//            String fileName = String.format("expense_%s_%s.csv", invoiceNumber, timestamp);
//            Path filePath = Paths.get(csvDownloadPath, fileName);
//
//            // Write content to file
//            Files.write(filePath, csvContent.getBytes());
//
//            logger.info("CSV file saved successfully at: " + filePath);
//
//            return ResponseEntity.ok()
//                    .body(Map.of(
//                            "message", "CSV file saved successfully",
//                            "path", filePath.toString()
//                    ));
//
//        } catch (Exception e) {
//            logger.error("Error saving CSV file: ", e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("error", "Failed to save CSV file: " + e.getMessage()));
//        }
//    }
//}

    private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);
    private static final String csvDownloadPath = "C:/Users/nithya prashanth/Desktop/images/Expense-Invoice";



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

            // Generate filename with timestamp
            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String filename = String.format("expense_%s_%s.csv", invoiceNumber, timestamp);
            Path filePath = Paths.get(csvDownloadPath, filename);

            // Write content to file
            Files.write(filePath, csvContent.getBytes(StandardCharsets.UTF_8));

            // Read the file and prepare it for download
            byte[] fileContent = Files.readAllBytes(filePath);

            // Set response headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDisposition(ContentDisposition.attachment().filename(filename).build());
            headers.setContentLength(fileContent.length);

            // Simple logging without placeholders
            logger.info("CSV file saved successfully at: " + filePath.toString());

            // Return both the file content for download and the saved file path
            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);

        } catch (Exception e) {
            // Simple logging without placeholders
            logger.error("Error processing CSV file: " + e.getMessage());
            return new ResponseEntity<>(Map.of(
                    "error", "Failed to process CSV file: " + e.getMessage()
            ), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
//    private static final String CSV_DOWNLOAD_PATH = "C:/Users/nithya prashanth/Desktop/images/Expense-Invoice";

//    @PostMapping("/download-csv/{id}")
//    public ResponseEntity<Map<String, String>> downloadCSV(@RequestBody Map<String, String> request) {
//        try {
//            String csvContent = request.get("content");
//            String invoiceNumber = request.get("invoiceNumber");
//
//            // Define the directory and file name
//            String directoryPath = "C:/Users/nithya prashanth/Desktop/images/Expense-Invoice";
//            File directory = new File(directoryPath);
//
//            // Create directory if it doesn't exist
//            if (!directory.exists() && !directory.mkdirs()) {
//                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                        .body(Map.of("message", "Failed to create directory"));
//            }
//
//            String fileName = "Expense_" + invoiceNumber + ".csv";
//            Path filePath = Paths.get(directoryPath, fileName);
//
//            // Write CSV content to the file
//            Files.write(filePath, csvContent.getBytes(StandardCharsets.UTF_8));
//
//            return ResponseEntity.ok(Map.of(
//                    "message", "CSV file saved successfully",
//                    "filePath", filePath.toString()
//            ));
//        } catch (IOException e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("message", "Failed to save CSV file", "error", e.getMessage()));
//        }
//    }



//    @GetMapping("/download-csv/{id}")
//    public ResponseEntity<Void> downloadCSV(@PathVariable Long id) {
//        try {
//            Expense expense = expenseRepository.findById(id)
//                    .orElseThrow(() -> new RuntimeException("Payroll not found"));
//
//            File directory = new File(CSV_DOWNLOAD_PATH);
//            if (!directory.exists()) {
//                directory.mkdirs();
//            }
//
//            String fileName = "expense_" + expense.getInvoiceNumber() + ".csv";
//            File file = new File(directory, fileName);
//
//            try (FileWriter writer = new FileWriter(file)) {
//                CSVWriter csvWriter = new CSVWriter(writer);
//
//                // Write headers
//                String[] headers = {"Invoice Number", "Expense-Type", "Expense-Description", "Expense-Amount",
//                        };
//                csvWriter.writeNext(headers);
//
//                // Write data
//                String[] data = {
//                        expense.getInvoiceNumber(),
//                        expense.getExpenseType(),
//                        expense.getExpenseDescription(),
//                        expense.getExpenseAmount().toString(),
////                        expense.getAllowanceAmount().toString(),
////                        expense.getDeductions().toString(),
////                        expense.getTotalAmount().toString()
//                };
//                csvWriter.writeNext(data);
//                csvWriter.close();
//
//                return ResponseEntity.ok().build();
//            }
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }
//

