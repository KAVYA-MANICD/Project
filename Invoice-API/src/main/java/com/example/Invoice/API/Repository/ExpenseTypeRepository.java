package com.example.Invoice.API.Repository;

import com.example.Invoice.API.Modal.Expensetype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseTypeRepository extends JpaRepository<Expensetype, Long> {
    // Optional: Add custom query methods if needed
}

