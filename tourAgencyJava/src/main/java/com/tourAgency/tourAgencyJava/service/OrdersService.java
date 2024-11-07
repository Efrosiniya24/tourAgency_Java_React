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

    public int quantityOfAllOrders(){
       int quantityOfOrders = orderRepository.findAll()
               .size();
        return quantityOfOrders;
    }

    public int quantityOfFemaleOrders() {
        int quantityOfFemaleOrders = (int) orderRepository.findAll()
                .stream()
                .filter(order -> order.getUser().getGenderClient().equals("female"))
                .count();
        return quantityOfFemaleOrders;
    }

    public int quantityOfMaleOrders() {
        int quantityOfMaleOrders = (int) orderRepository.findAll()
                .stream()
                .filter(order -> order.getUser().getGenderClient().equals("male"))
                .count();
        return quantityOfMaleOrders;
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
        return orderRepository.findAllWithUser();
    }

    public String updateStatus(Long id, String status) {
        Order newOrder = orderRepository.findById(id);
        newOrder.setStatus(status);
        orderRepository.save(newOrder);
        return newOrder.getStatus();
    }

    public int quantityOrdersPeriod(String date, String country){
        int orders = (int) orderRepository.findAllWithUser()
                .stream()
                .filter(order -> order.getDate().equals(date) && order.getTour().getCountry().equals(country))
                .count();
        return orders;
    }
}


