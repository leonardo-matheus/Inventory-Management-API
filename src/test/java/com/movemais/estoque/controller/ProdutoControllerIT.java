package com.movemais.estoque.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.movemais.estoque.dto.auth.LoginRequest;
import com.movemais.estoque.dto.produto.ProdutoCreateRequest;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.*;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProdutoControllerIT {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper mapper;

    String token;

    @BeforeEach
    void autenticar() throws Exception {
        LoginRequest login = new LoginRequest("admin", "admin123");

        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();
        token = "Bearer " + mapper.readTree(json).get("accessToken").asText();
    }

    @Test
    void deveCriarProduto() throws Exception {
        ProdutoCreateRequest req = new ProdutoCreateRequest("SKU-TESTE", "Produto Teste", "desc", BigDecimal.TEN);

        mockMvc.perform(post("/api/produtos")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sku").value("SKU-TESTE"))
                .andExpect(jsonPath("$.nome").value("Produto Teste"));
    }
}