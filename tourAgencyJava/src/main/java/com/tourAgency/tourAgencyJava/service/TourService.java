package com.tourAgency.tourAgencyJava.service;

import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.repositories.ToursRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class TourService {
    private final ToursRepository toursRepository;

    public Tours addTour(Tours tours) {
        toursRepository.save(tours);
        return null;
    }
}
