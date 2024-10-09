package com.tourAgency.tourAgencyJava.controller;

import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.model.User;
import com.tourAgency.tourAgencyJava.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tourAgency/admin")
@Slf4j
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.DELETE, RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/allUsers")
    public ResponseEntity<?> allUsers() {
        List<User> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/currentUser")
    public ResponseEntity<?> currentUser(@RequestParam String nameUser) {
        Optional<User> user = userService.currentUser(nameUser);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/searchUser")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<User>> searchUser(@RequestParam String nameUser) {
        List<User> users = userService.searchUser(nameUser);
        return ResponseEntity.ok(users);
    }
}
