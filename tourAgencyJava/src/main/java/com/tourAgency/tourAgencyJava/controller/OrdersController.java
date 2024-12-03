package com.tourAgency.tourAgencyJava.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.tourAgency.tourAgencyJava.model.Language;
import com.tourAgency.tourAgencyJava.model.Order;
import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.model.User;
import com.tourAgency.tourAgencyJava.repositories.LanguageRepository;
import com.tourAgency.tourAgencyJava.service.OrdersService;
import com.tourAgency.tourAgencyJava.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("tourAgency/orders")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.DELETE, RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
public class OrdersController {
    private final OrdersService  ordersService;
    private final UserService userService;
    private final ObjectMapper objectMapper;
    private final LanguageRepository languageRepository;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/quantityOfAllOrders")
    public ResponseEntity<?> quantityOfAllOrders() {
        int numberOfOrders = ordersService.quantityOfAllOrders();
        return ResponseEntity.ok(numberOfOrders);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/quantityOfFemaleOrders")
    public  ResponseEntity<?> quantityOfFemaleOrders(){
        int numberOfFemaleOrders = ordersService.quantityOfFemaleOrders();
        return ResponseEntity.ok(numberOfFemaleOrders);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/quantityOfMaleOrdes")
    public ResponseEntity<?> quantityOfOrdersMaleOrdes() {
        int numberOfMaleOrdes = ordersService.quantityOfMaleOrders();
        return ResponseEntity.ok(numberOfMaleOrdes);
    }

    @Transactional
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/addOrder")
    public ResponseEntity<Order> addOrder(
            @RequestPart ("order") String orderJson,
            @RequestPart ("user") String userJson,
            @RequestParam("languages") List<String> languageNames) {
        Order order;
        User user;
        System.out.println(orderJson);
        System.out.println(languageNames);
        System.out.println(userJson);

        try {
            order = objectMapper.readValue(orderJson, Order.class);
            user = objectMapper.readValue(userJson, User.class);
            Order savedOrder = ordersService.addOrder(order, languageNames, user);
            return ResponseEntity.ok(savedOrder);
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при десериализации JSON" + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/getOrders")
    public ResponseEntity<List<Order>> getOrders() {
        List<Order> orders = ordersService.getOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping ("/getOrders/{id}")
    public ResponseEntity<List<Order>> getAllOrdersFromUser(@PathVariable Long id){
        List<Order> orders = ordersService.allOrdersFromUser(id).orElse(List.of());
        return ResponseEntity.ok(orders);
    }

    @Transactional
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<Order> changeStatus(@PathVariable Long id, @RequestBody String newStatus) {
        Order order = ordersService.updateStatus(id, newStatus);
        return ResponseEntity.ok(order);
    }
}
