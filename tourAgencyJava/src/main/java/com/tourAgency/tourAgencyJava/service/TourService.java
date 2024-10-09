package com.tourAgency.tourAgencyJava.service;

import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.repositories.ToursRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class TourService {
    private final ToursRepository toursRepository;

    public Tours addTour(Tours tours) {
        tours.setOrders(null);
        return toursRepository.save(tours);
    }

    public List<Tours> allTours() {
        return toursRepository.findAll();
    }

    public void deleteTour(Long id) {
        toursRepository.deleteById(Math.toIntExact(id));
    }

    public List<Tours> updateTour(Tours tour, Long id) {
        List<Tours> allTours = toursRepository.findAll();
        allTours.set(Math.toIntExact(id), tour);
        toursRepository.saveAll(allTours);
        return allTours;
    }

    public List<Tours> searchTour(String line) {
        String lineLowerCase = line.toLowerCase();
        List<Tours> allTours = toursRepository.findAll()
                .stream()
                .filter(tour -> tour.getCountry().toLowerCase().contains(lineLowerCase)
                        || tour.getName().toLowerCase().contains(lineLowerCase)
                        || tour.getLocation().toLowerCase().contains(lineLowerCase))
                .collect(Collectors.toList());
        return allTours;
    }
}
