package com.infosys.aibudgettracker.authservice.dto;

import com.infosys.aibudgettracker.authservice.model.User.Role;
import lombok.Data;

@Data
public class SignUpRequest {
    private String username;
    private String email;
    private String password;
    private Role role;
}