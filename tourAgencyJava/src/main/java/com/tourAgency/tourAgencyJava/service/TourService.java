package com.tourAgency.tourAgencyJava.service;

import com.tourAgency.tourAgencyJava.model.Photo;
import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.repositories.PhotoRepository;
import com.tourAgency.tourAgencyJava.repositories.ToursRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class TourService {
    private final ToursRepository toursRepository;
    private final PhotoRepository photoRepository;

    public Tours addTour(Tours tours, List<MultipartFile> images) {
        tours.setOrders(null);

        Tours savedTours = toursRepository.save(tours);
        List<Photo> photos = images.stream()
                .map(image -> {
                    try {
                        return Photo.builder()
                                .tour(savedTours)
                                .imageData(image.getBytes())
                                .build();
                    } catch (IOException e) {
                        throw new RuntimeException("Ошибка при чтении файла", e);
                    }
                })
                .collect(Collectors.toList());

        photoRepository.saveAll(photos);
        savedTours.setPhotos(photos);
        return toursRepository.save(tours);
    }

    public List<Tours> allTours() {
        return toursRepository.findAll();
    }

    public Tours getTourById(int id) {
        return toursRepository.findById(id).orElse(null);
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
