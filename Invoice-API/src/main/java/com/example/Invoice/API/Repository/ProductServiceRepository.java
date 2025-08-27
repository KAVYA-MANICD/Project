package com.example.Invoice.API.Repository;

import com.example.Invoice.API.Modal.ProductService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductServiceRepository extends JpaRepository<ProductService, Long> {
}
