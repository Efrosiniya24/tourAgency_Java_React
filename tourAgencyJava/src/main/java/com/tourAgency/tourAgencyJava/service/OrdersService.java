package com.tourAgency.tourAgencyJava.service;

import com.tourAgency.tourAgencyJava.model.Order;
import com.tourAgency.tourAgencyJava.model.User;
import com.tourAgency.tourAgencyJava.repositories.OrderRepository;
import com.tourAgency.tourAgencyJava.repositories.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class OrdersService {

    OrderRepository orderRepository;
    UserRepository userRepository;

    public int numberOfOrders(){
        List<Order> orders = orderRepository.findAll();
        return orders.size();
    }

    public int numberOfFemaleOrders() {
        List<Order> orders = orderRepository.findAll();
        return (int) orders.stream()
                .filter(order -> order.getUser().getGenderClient().equals("female"))
                .count();
    }

    public int numberOfMaleOrders() {
        List<Order> orders = orderRepository.findAll();
        return (int) orders.stream()
                .filter(order -> order.getUser().getGenderClient().equals("male"))
                .count();
    }

    public User addOrder(Order order, User user) {
        List<Order> orders = user.getOrders();
        orders.add(order);
        user.setOrders(orders);
        return user;
    }
}
