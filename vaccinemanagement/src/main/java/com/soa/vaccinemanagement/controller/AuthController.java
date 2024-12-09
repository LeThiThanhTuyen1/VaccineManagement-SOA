package com.soa.vaccinemanagement.controller;

import com.soa.vaccinemanagement.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public String login(@RequestParam String userName, @RequestParam String password) {
    	return authService.login(userName, password);
    }

    @GetMapping("/validate")
    public String validateToken(@RequestParam String token) {
        if (authService.validateToken(token)) {
            return "Token is valid";
        } else {
            return "Invalid token";
        }
    }
    
//    @PostMapping("/login")
//    public String login(@RequestBody Map<String, String> credentials) {
//        String userName = credentials.get("userName");
//        String password = credentials.get("password");
//        return authService.login(userName, password);
//    }

}