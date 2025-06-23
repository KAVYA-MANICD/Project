package com.example.Invoice.API.Controller;

import com.example.Invoice.API.Modal.Client;
import com.example.Invoice.API.Repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
@CrossOrigin
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    // Add new client
    @PostMapping("/add")
    public ResponseEntity<Client> addClient(@RequestBody Client client) {
        Client savedClient = clientRepository.save(client);
        return ResponseEntity.ok(savedClient);
    }

    // View client list
    @GetMapping("/all")
    public ResponseEntity<List<Client>> getAllClients() {
        List<Client> clients = clientRepository.findAll();
        return ResponseEntity.ok(clients);
    }

    // Edit client info
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client clientDetails) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found with id " + id));

        client.setName(clientDetails.getName());
        client.setEmail(clientDetails.getEmail());
        client.setPhone(clientDetails.getPhone());
        client.setCompanyName(clientDetails.getCompanyName());
        client.setTaxId(clientDetails.getTaxId());
        client.setBillingAddress(clientDetails.getBillingAddress());
        client.setShippingAddress(clientDetails.getShippingAddress());
        client.setCountry(clientDetails.getCountry());
        client.setState(clientDetails.getState());
        client.setCity(clientDetails.getCity());
        client.setZipCode(clientDetails.getZipCode());

        Client updatedClient = clientRepository.save(client);
        return ResponseEntity.ok(updatedClient);
    }

    // Delete client info
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found with id " + id));
        clientRepository.delete(client);
        return ResponseEntity.noContent().build();
    }
}
