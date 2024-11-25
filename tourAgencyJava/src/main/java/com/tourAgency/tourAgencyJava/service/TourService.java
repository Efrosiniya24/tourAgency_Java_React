package com.tourAgency.tourAgencyJava.service;

import com.tourAgency.tourAgencyJava.model.Language;
import com.tourAgency.tourAgencyJava.model.Photo;
import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.repositories.LanguageRepository;
import com.tourAgency.tourAgencyJava.repositories.PhotoRepository;
import com.tourAgency.tourAgencyJava.repositories.ToursRepository;
import jakarta.persistence.EntityManager;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class TourService {
    private final ToursRepository toursRepository;
    private final PhotoRepository photoRepository;
    private final LanguageRepository languageRepository;
    private final EntityManager entityManager;

    @Transactional
    public Tours addTour(Tours tours, List<MultipartFile> images, List<String> languageNames) {
        if (languageNames != null) {
            List<Language> languages = languageRepository.findByLanguageIn(languageNames);
            List<Language> managedLanguages = languages.stream()
                    .map(entityManager::merge)
                    .collect(Collectors.toList());
            tours.setLanguages(managedLanguages);
        }

        tours.setOrders(null);;

        Tours savedTours = toursRepository.save(tours);
        List<Photo> photos = setPhoto(images, savedTours);

        photoRepository.saveAll(photos);
        savedTours.setPhotos(photos);
        return toursRepository.save(tours);
    }

    @Transactional
    public List<Tours> allTours() {
        return toursRepository.findAll();
    }

    @Transactional
    public Tours getTourById(long id) {
        Tours tour = toursRepository.findById((int) id).orElse(null);
        if (tour != null) {
            Hibernate.initialize(tour.getLanguages());
        }
        return tour;
    }

    public void deleteTour(Long id) {
        toursRepository.deleteById(Math.toIntExact(id));
    }


    @Transactional
    public Tours updateTour(Tours updatedTour, Long id, List<MultipartFile> newImages, List<String> languageNames) {
        System.out.println(languageNames);
        return toursRepository.findById(Math.toIntExact(id))
                .map(existingTour -> {
                    Hibernate.initialize(existingTour.getPhotos());
                    Hibernate.initialize(existingTour.getLanguages());

                    existingTour.setName(updatedTour.getName());
                    existingTour.setCountry(updatedTour.getCountry());
                    existingTour.setBeginningDate(updatedTour.getBeginningDate());
                    existingTour.setEndDate(updatedTour.getEndDate());
                    existingTour.setNumberOfDays(updatedTour.getNumberOfDays());
                    existingTour.setProgram(updatedTour.getProgram());
                    existingTour.setLocation(updatedTour.getLocation());
                    existingTour.setPrice(updatedTour.getPrice());
                    existingTour.setDescription(updatedTour.getDescription());

                    if (languageNames != null) {
                        List<Language> languages = languageRepository.findByLanguageIn(languageNames);
                        existingTour.setLanguages(languages);
                    }

                    List<Photo> existingPhotos = existingTour.getPhotos() != null
                            ? existingTour.getPhotos()
                            : new ArrayList<>();

                    if (newImages != null && !newImages.isEmpty()) {
                        for (int i = 0; i < newImages.size(); i++) {
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

    public List<Tours> sortToursCostCheap() {
        return toursRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Tours::getPrice))
                .collect(Collectors.toList());
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

    public long countTours(){
        return toursRepository.count();
    }

    public List<Tours> sortToursCostExpensive() {
        return toursRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Tours::getPrice).reversed())
                .collect(Collectors.toList());
    }
}


