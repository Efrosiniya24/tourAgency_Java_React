package com.tourAgency.tourAgencyJava.service;

import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.repositories.ToursRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class TourService {
    private final ToursRepository toursRepository;

    public Tours addTour(Tours tours) {
        toursRepository.save(tours);
        return null;
    }

    public List<Tours> allTours() {
        return toursRepository.findAll();
    }
}
