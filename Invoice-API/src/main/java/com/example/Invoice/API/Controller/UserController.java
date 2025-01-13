package com.example.Invoice.API.Controller;

import com.example.Invoice.API.Modal.User;
import com.example.Invoice.API.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")

@RestController
@RequestMapping("/api/admin")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    // Base64 encode password
    private String encodePassword(String password) {
        return Base64.getEncoder().encodeToString(password.getBytes());
    }

    // Base64 decode password
    private String decodePassword(String encodedPassword) {
        byte[] decodedBytes = Base64.getDecoder().decode(encodedPassword);
        return new String(decodedBytes);
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User admin = userRepository.findByEmail(user.getEmail());

        if (admin != null) {
            String decodedStoredPassword = decodePassword(admin.getPassword());

            if (decodedStoredPassword.equals(user.getPassword())) {
                return ResponseEntity.ok().body(Map.of("message", "Login successful"));
            }
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
    }

}