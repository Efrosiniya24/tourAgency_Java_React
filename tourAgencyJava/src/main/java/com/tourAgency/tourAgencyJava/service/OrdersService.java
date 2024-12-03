package com.tourAgency.tourAgencyJava.service;

import com.tourAgency.tourAgencyJava.model.*;
import com.tourAgency.tourAgencyJava.repositories.LanguageRepository;
import com.tourAgency.tourAgencyJava.repositories.OrderRepository;
import com.tourAgency.tourAgencyJava.repositories.ToursRepository;
import com.tourAgency.tourAgencyJava.repositories.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@AllArgsConstructor

public class OrdersService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final LanguageRepository languageRepository;
    private final EntityManager entityManager;
    private final UserService userService;
    private final ToursRepository toursRepository;

    public long quantityOfAllOrders(){
        return orderRepository.findAll()
                .size();
    }

    public int quantityOfFemaleOrders() {
        return (int) orderRepository.findAll()
                .stream()
                .filter(order -> order.getUser().getGenderClient().equals("female"))
                .count();
    }

    public int quantityOfMaleOrders() {
        return (int) orderRepository.findAll()
                .stream()
                .filter(order -> order.getUser().getGenderClient().equals("male"))
                .count();
    }

    public Order addOrder(Order order,List<String> languageNames, User user) {
        User existingUser = userService.getCurrentUser();
        boolean isUpdated = false;

        if (!Objects.equals(existingUser.getName(), user.getName())) {
            existingUser.setName(user.getName());
            isUpdated = true;
        }
        if (!Objects.equals(existingUser.getSurname(), user.getSurname())) {
            existingUser.setSurname(user.getSurname());
            isUpdated = true;
        }
        if (!Objects.equals(existingUser.getPatronymic(), user.getPatronymic())) {
            existingUser.setPatronymic(user.getPatronymic());
            isUpdated = true;
        }
        if (!Objects.equals(existingUser.getEmail(), user.getEmail())) {
            existingUser.setEmail(user.getEmail());
            isUpdated = true;
        }
        if (!Objects.equals(existingUser.getPhoneNumber(), user.getPhoneNumber())) {
            existingUser.setPhoneNumber(user.getPhoneNumber());
            isUpdated = true;
        }
        if (!Objects.equals(existingUser.getGenderClient(), user.getGenderClient())) {
            existingUser.setGenderClient(user.getGenderClient());
            isUpdated = true;
        }
        if (!Objects.equals(existingUser.getPassportNumber(), user.getPassportNumber())) {
            existingUser.setPassportNumber(user.getPassportNumber());
            isUpdated = true;
        }
        if (!Objects.equals(existingUser.getPassportSeries(), user.getPassportSeries())) {
            existingUser.setPassportSeries(user.getPassportSeries());
            isUpdated = true;
        }

        if (isUpdated)
            userRepository.save(existingUser);

        if (languageNames != null)
            order.setLanguages(languageRepository.findByLanguageIn(languageNames));

        order.setUser(existingUser);
        order.setEndDate(order.getDate().plusDays(order.getNumberOfDays()));
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateStatus(Long id, String status) {
        Order newOrder = orderRepository.findById(id);
        newOrder.setStatus(status);
        newOrder.setUpdateStatusDate(LocalDate.now());
        newOrder.getLanguages().size();
        orderRepository.save(newOrder);

        return newOrder;
    }

    public Optional<List<Order>>  allOrdersFromUser (Long id){
        return Optional.ofNullable(userRepository.findById(id).get().getOrders());
    }

    public int quantityOrdersPeriod(String date, String country){
        int orders = (int) orderRepository.findAllWithUserAndLanguages()
                .stream()
//                .filter(order -> order.getDate().equals(date) && order.getTour().getCountry().equals(country))
                .count();
        return orders;
    }

    public List<Order> getOrders() {
        return orderRepository.findAllWithUserAndLanguages();
    }

}


