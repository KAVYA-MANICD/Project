package com.example.Invoice.API.Repository;

import com.example.Invoice.API.Modal.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByNameContaining(String name);
}
