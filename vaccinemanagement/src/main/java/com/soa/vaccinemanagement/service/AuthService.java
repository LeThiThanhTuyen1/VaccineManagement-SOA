package com.soa.vaccinemanagement.service;

import com.soa.vaccinemanagement.model.User;
import com.soa.vaccinemanagement.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.util.Date;
import java.util.Optional;

@Service
public class AuthService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    private String md5Hash(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error hashing password");
        }
    }

    public String login(String userName, String password) {
        Optional<User> userOpt = userRepository.findByUserName(userName);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(md5Hash(password))) {
            String token = generateToken(userOpt.get().getUserName());
            User user = userOpt.get();
            user.setToken(token);
            userRepository.save(user);
            return token;
        }
        throw new IllegalArgumentException("Invalid credentials");
    }

    private String generateToken(String userName) {
        return Jwts.builder()
                .setSubject(userName)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}