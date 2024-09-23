package com.tourAgency.tourAgencyJava.repositories;

import com.tourAgency.tourAgencyJava.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    Optional<User> findById(Long Id);
}
