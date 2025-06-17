package com.example.Invoice.API.Repository;

import com.example.Invoice.API.Modal.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    // Additional query methods can be defined here
}

