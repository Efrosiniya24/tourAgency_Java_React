package com.tourAgency.tourAgencyJava.service;

import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.repositories.ToursRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class TourService {
    private final ToursRepository toursRepository;

    public List<Tours> addTour(Tours tours) {
        tours.setOrders(null);
        List<Tours> toursList = toursRepository.findAll();
        toursList.add(tours);
        toursRepository.saveAll(toursList);
        return toursList;
    }

    public List<Tours> allTours() {
        return toursRepository.findAll();
    }

    public void deleteTour(Long id) {
        toursRepository.deleteById(Math.toIntExact(id));
    }
}
