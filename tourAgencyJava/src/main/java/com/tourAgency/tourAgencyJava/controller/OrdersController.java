package com.tourAgency.tourAgencyJava.controller;


import com.tourAgency.tourAgencyJava.model.Order;
import com.tourAgency.tourAgencyJava.service.OrdersService;
import com.tourAgency.tourAgencyJava.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("tourAgency/orders")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.DELETE, RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})

public class OrdersController {
    private final OrdersService  ordersService;
    private final UserService userService;

//    @GetMapping("/quantityOfAllOrders")
//    public ResponseEntity<?> quantityOfOrders() {
//        int numberOfOrders = ordersService.quantityOfOrders();
//        return ResponseEntity.ok(numberOfOrders);
//    }

    @GetMapping("/numbersOfFemaleOrders")
    public  ResponseEntity<?> numberOfOrdersFemale(){
        int numberOfFemaleOrders = ordersService.numberOfFemaleOrders();
        return ResponseEntity.ok(numberOfFemaleOrders);
    }

    @GetMapping("/numbersOfMaleOrdes")
    public ResponseEntity<?> numberOfOrdersMaleOrdes() {
        int numberOfMaleOrdes = ordersService.numberOfMaleOrders();
        return ResponseEntity.ok(numberOfMaleOrdes);
    }

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/addOrder")
    public ResponseEntity<Order> addOrder(@RequestBody Order order) {
        Order newOrder = ordersService.addOrder(order, userService.getCurrentUser());
        return ResponseEntity.ok(newOrder);
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
}
