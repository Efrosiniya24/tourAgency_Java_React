package com.tourAgency.tourAgencyJava.service;

import com.tourAgency.tourAgencyJava.model.Order;
import com.tourAgency.tourAgencyJava.model.User;
import com.tourAgency.tourAgencyJava.repositories.OrderRepository;
import com.tourAgency.tourAgencyJava.repositories.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor

public class OrdersService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

//    public int quantityOfOrders(){
//        List<User> users = userRepository.findAll();
//        int orders = (int) users.stream().map(user -> user.getOrders().size().c);
//
//        return orders;
//    }

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

    public Order addOrder(Order order, User user) {
        List<Order> orders = user.getOrders();
        orders.add(order);
        user.setOrders(orders);
        userRepository.save(user);
        return order;
    }

    public Optional<List<Order>>  allOrdersFromUser (Long id){
        return Optional.ofNullable(userRepository.findById(id).get().getOrders());
    }

    public List<Order> getOrders() {
        return orderRepository.findAll();
    }
}


