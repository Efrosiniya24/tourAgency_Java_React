package com.tourAgency.tourAgencyJava.service;

import com.tourAgency.tourAgencyJava.model.Enum.Role;
import com.tourAgency.tourAgencyJava.model.Order;
import com.tourAgency.tourAgencyJava.model.User;
import com.tourAgency.tourAgencyJava.repositories.OrderRepository;
import com.tourAgency.tourAgencyJava.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EncryptionService encryptionService;

    public List<User> allUsers() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == Role.USER)
                .toList();
    }

    public User prepareUser(User user) {
        user.setEncryptionService(encryptionService);
        return user;
    }

//    public Optional<User> currentUser(String nameUser) {
//        List<User> users = userRepository.findAll();
//        return users.stream()
//                .filter(user -> user.getName().equals(nameUser))
//                .findFirst();
//    }

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email" + email));
    }

    public List<User> searchUser(String nameUser) {
        String[] nameParts = nameUser.split(" ");
        List<User> users = userRepository.findAll()
                .stream()
                .filter(user -> Arrays.stream(nameParts)
                        .anyMatch(part -> user.getName().toLowerCase().contains(part.toLowerCase())
                                || user.getPatronymic().toLowerCase().contains(part.toLowerCase())
                                || user.getSurname().toLowerCase().contains(part.toLowerCase()))
                )
                .collect(Collectors.toList());
        return users;
    }
}
