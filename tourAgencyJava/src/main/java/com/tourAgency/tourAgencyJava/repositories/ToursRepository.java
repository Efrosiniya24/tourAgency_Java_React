package com.tourAgency.tourAgencyJava.repositories;

import com.tourAgency.tourAgencyJava.model.Tours;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ToursRepository extends JpaRepository<Tours, Integer> {
    Optional<Tours> findById(int id);
}
