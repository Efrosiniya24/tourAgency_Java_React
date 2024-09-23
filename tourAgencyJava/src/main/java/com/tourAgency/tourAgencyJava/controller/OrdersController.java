package com.tourAgency.tourAgencyJava.controller;


import com.tourAgency.tourAgencyJava.model.Order;
import com.tourAgency.tourAgencyJava.model.User;
import com.tourAgency.tourAgencyJava.service.OrdersService;
import com.tourAgency.tourAgencyJava.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("tourAgency/orders")
public class OrdersController {
    OrdersService  ordersService;
    UserService userService;

    @GetMapping("/numbersOfAllOrders")
    public ResponseEntity<?> numberOfOrders() {
        int numberOfOrders = ordersService.numberOfOrders();
        return ResponseEntity.ok(numberOfOrders);
    }

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

    @GetMapping("/addOrder")
    public ResponseEntity<?> addOrder(@RequestBody Order order) {
        User newOrder = ordersService.addOrder(order, userService.getCurrentUser());
        return ResponseEntity.ok(newOrder);
    }
}
