package com.tourAgency.tourAgencyJava.service;

import com.tourAgency.tourAgencyJava.model.Photo;
import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.repositories.PhotoRepository;
import com.tourAgency.tourAgencyJava.repositories.ToursRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
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
        List<Photo> photos = setPhoto(images, savedTours);

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


    @Transactional
    public Tours updateTour(Tours updatedTour, Long id, List<MultipartFile> newImages) {
        return toursRepository.findById(Math.toIntExact(id))
                .map(existingTour -> {
                    Hibernate.initialize(existingTour.getPhotos());

                    existingTour.setName(updatedTour.getName());
                    existingTour.setCountry(updatedTour.getCountry());
                    existingTour.setBeginningDate(updatedTour.getBeginningDate());
                    existingTour.setEndDate(updatedTour.getEndDate());
                    existingTour.setNumberOfDays(updatedTour.getNumberOfDays());
                    existingTour.setProgram(updatedTour.getProgram());
                    existingTour.setLocation(updatedTour.getLocation());
                    existingTour.setPrice(updatedTour.getPrice());
                    existingTour.setDescription(updatedTour.getDescription());

                    List<Photo> existingPhotos = existingTour.getPhotos();

                    if (newImages != null && !newImages.isEmpty()) {
                        int size = newImages.size();
                        for (int i = 0; i < size; i++) {
                            MultipartFile newImage = newImages.get(i);
                            if (newImage != null) {
                                try {
                                    if (i < existingPhotos.size()) {
                                        existingPhotos.get(i).setImageData(newImage.getBytes());
                                    } else {
                                        Photo newPhoto = Photo.builder()
                                                .imageData(newImage.getBytes())
                                                .tour(existingTour)
                                                .build();
                                        existingPhotos.add(newPhoto);
                                    }
                                } catch (IOException e) {
                                    throw new RuntimeException("Ошибка при чтении файла изображения", e);
                                }
                            }
                        }
                    }

                    existingTour.setPhotos(existingPhotos);
                    photoRepository.saveAll(existingPhotos);
                    return toursRepository.save(existingTour);
                })
                .orElseThrow(() -> new RuntimeException("Тур с ID " + id + " не найден"));
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

    public List<Tours> sortToursCost() {
        return (List<Tours>) toursRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Tours::getPrice));
    }

    public List<Photo> setPhoto(List<MultipartFile> newImages, Tours tour) {
        return newImages.stream()
                .map(image -> {
                    try {
                        return Photo.builder()
                                .tour(tour)
                                .imageData(image.getBytes())
                                .build();
                    } catch (IOException e) {
                        throw new RuntimeException("Ошибка при чтении файла", e);
                    }
                })
                .collect(Collectors.toList());
    }
}


