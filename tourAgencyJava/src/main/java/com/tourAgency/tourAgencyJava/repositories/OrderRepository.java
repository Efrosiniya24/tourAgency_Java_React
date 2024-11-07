package com.tourAgency.tourAgencyJava.repositories;

import com.tourAgency.tourAgencyJava.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    Order findById(Long id);
    @Query("SELECT orders FROM Order orders JOIN FETCH orders.user")
    List<Order> findAllWithUser();
}
