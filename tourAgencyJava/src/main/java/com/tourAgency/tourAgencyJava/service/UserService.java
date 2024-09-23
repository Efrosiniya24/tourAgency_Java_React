package com.tourAgency.tourAgencyJava.service;

import com.tourAgency.tourAgencyJava.model.User;
import com.tourAgency.tourAgencyJava.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    UserRepository userRepository;
    
    public List<User> allUsers(){
        List<User> users = userRepository.findAll();
        return users;
    }

    public Optional<User> currentUser(String nameUser) {
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(user -> user.getName().equals(nameUser))
                .findFirst();
    }
    public User getCurrentUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email" + email));
    }
}
