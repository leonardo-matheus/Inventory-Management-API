package com.movemais.estoque.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BcryptCheck {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String raw = "admin123";
        String hash = encoder.encode(raw);
        System.out.println("Hash: " + hash);
        System.out.println("Match: " + encoder.matches(raw, hash));
    }
}