package com.tourAgency.tourAgencyJava.repositories;

import com.tourAgency.tourAgencyJava.model.Tours;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ToursRepository extends JpaRepository<Tours, Integer> {
}
