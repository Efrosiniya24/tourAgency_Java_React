package com.tourAgency.tourAgencyJava.controller;

import com.tourAgency.tourAgencyJava.model.Order;
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
import java.util.OptionalDouble;

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
        log.info("Called allUsers endpoint");
        List<User> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }


    @GetMapping("/searchUser")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<User>> searchUser(@RequestParam String nameUser) {
        List<User> users = userService.searchUser(nameUser);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/getUserData")
    public ResponseEntity<User> getUserData() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(user);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/quantityOfAllUsers")
    public ResponseEntity<Long> quantityOfAllUsers() {
        long quantity = userService.quantityOfAllUser();
        return ResponseEntity.ok(quantity);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/averageAgeClient")
    public ResponseEntity<OptionalDouble> averageAgeClient() {
        OptionalDouble averageAgeClient = userService.averageAgeClient();
        return ResponseEntity.ok(averageAgeClient);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/averageAgeFemale")
    public ResponseEntity<OptionalDouble> averageAgeFemale() {
        OptionalDouble averageAgeFemale = userService.averageAgeFemale();
        return ResponseEntity.ok(averageAgeFemale);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/averageAgeMale")
    public ResponseEntity<OptionalDouble> averageAgeMale() {
        OptionalDouble averageAgeMale = userService.averageAgeMale();
        return ResponseEntity.ok(averageAgeMale);
    }

    @GetMapping("/quantityOfOrders/{id}")
    public ResponseEntity<Integer> quantityOfOrders(@PathVariable Long id) {
            int quantityOfOrders = userService.quantityOfOrders(id);
            return ResponseEntity.ok(quantityOfOrders);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/percentageOfMale")
    public ResponseEntity<Double> percentageOfMale() {
        return ResponseEntity.ok(userService.percentageOfMale());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/percentageOfFemale")
    public ResponseEntity<Double> percentageOfFemale() {
        return ResponseEntity.ok(userService.percentageOfFemale());
    }
}
