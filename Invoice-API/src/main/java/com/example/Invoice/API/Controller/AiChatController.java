package com.example.Invoice.API.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@CrossOrigin
public class AiChatController {

    private final RestTemplate restTemplate;
    private final JdbcTemplate jdbcTemplate;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Autowired
    public AiChatController(RestTemplate restTemplate, JdbcTemplate jdbcTemplate) {
        this.restTemplate = restTemplate;
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/ai")
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        String dbSchema = queryAllTables();
        String prompt = "Given the following database schema and data:\n" + dbSchema + "\n\n" + message;

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-goog-api-key", geminiApiKey);

        Map<String, Object> body = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        Map<String, Object>[] contents = new Map[]{new HashMap<>()};
        contents[0].put("parts", new Map[]{part});
        body.put("contents", contents);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        String response = restTemplate.postForObject(url, entity, String.class);

        Map<String, String> result = new HashMap<>();
        result.put("response", response);
        return result;
    }

    private String queryAllTables() {
        List<String> tableNames = jdbcTemplate.queryForList(
                "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'",
                String.class);

        Map<String, List<Map<String, Object>>> allTableData = new HashMap<>();
        for (String tableName : tableNames) {
            List<Map<String, Object>> tableData = jdbcTemplate.queryForList("SELECT * FROM " + tableName);
            allTableData.put(tableName, tableData);
        }

        try {
            return new ObjectMapper().writeValueAsString(allTableData);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting to JSON", e);
        }
    }
}
