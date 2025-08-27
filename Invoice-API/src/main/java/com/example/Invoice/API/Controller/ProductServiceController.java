package com.example.Invoice.API.Controller;

import com.example.Invoice.API.Modal.ProductService;
import com.example.Invoice.API.Repository.ProductServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product-services")
@CrossOrigin
public class ProductServiceController {

    @Autowired
    private ProductServiceRepository productServiceRepository;

    @PostMapping
    public ResponseEntity<ProductService> addProductService(@RequestBody ProductService productService) {
        ProductService savedProductService = productServiceRepository.save(productService);
        return ResponseEntity.ok(savedProductService);
    }

    @GetMapping
    public ResponseEntity<List<ProductService>> getAllProductServices() {
        List<ProductService> productServices = productServiceRepository.findAll();
        return ResponseEntity.ok(productServices);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductService> updateProductService(@PathVariable Long id, @RequestBody ProductService productServiceDetails) {
        ProductService productService = productServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product/Service not found with id " + id));

        productService.setName(productServiceDetails.getName());
        productService.setPrice(productServiceDetails.getPrice());

        ProductService updatedProductService = productServiceRepository.save(productService);
        return ResponseEntity.ok(updatedProductService);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductService(@PathVariable Long id) {
        ProductService productService = productServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product/Service not found with id " + id));
        productServiceRepository.delete(productService);
        return ResponseEntity.noContent().build();
    }
}
