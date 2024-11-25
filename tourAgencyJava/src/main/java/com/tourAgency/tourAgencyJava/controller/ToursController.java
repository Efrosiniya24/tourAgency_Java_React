package com.tourAgency.tourAgencyJava.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.service.TourService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;


@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.DELETE, RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/tourAgency/tours")
public class ToursController {
    private final TourService tourService;
    private final ObjectMapper objectMapper;

    @PostMapping(value = "/addTour", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Tours> addTour(
            @RequestPart("tours") String toursJson,
            @RequestPart("images") List<MultipartFile> images,
            @RequestParam("languages") List<String> languageNames) {
        Tours tours;
        try {
            tours = objectMapper.readValue(toursJson, Tours.class);
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при десериализации JSON" + e.getMessage());
        }

        Tours savedTour = tourService.addTour(tours, images, languageNames);
        return ResponseEntity.ok(savedTour);
    }


    @GetMapping("/allTours")
    @Transactional
    public ResponseEntity<List<Tours>> getAllTours() {
        List<Tours> tours = tourService.allTours();
        tours.forEach(tour -> {
            Hibernate.initialize(tour.getLanguages());
        });
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/tour/{id}")
    public ResponseEntity<Tours> getTourById(@PathVariable long id) {
        Tours tour = tourService.getTourById(id);
        Hibernate.initialize(tour.getLanguages())   ;
        return ResponseEntity.ok(tour);
    }


    @DeleteMapping("/deleteTour/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteTour(@PathVariable Long id) {
        tourService.deleteTour(id);
        return ResponseEntity.ok("Tour deleted");
    }

    @Transactional
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping(value = "/updateTour/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Tours> updateTour(
            @RequestPart("tours") String toursJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "languages", required = false) List<String> languageNames,
            @PathVariable Long id) {
        Tours tours;
        try {
            tours = objectMapper.readValue(toursJson, Tours.class);
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при десериализации JSON" + e.getMessage());
        }
        Tours updatedTour = tourService.updateTour(tours, id, images, languageNames);
        return ResponseEntity.ok(updatedTour);
    }


    @GetMapping("/search")
    public ResponseEntity<Optional<List<Tours>>> searchTours(@RequestParam String line){
        Optional<List<Tours>> tours = Optional.ofNullable(tourService.searchTour(line));
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/sortCostCheap")
    public ResponseEntity<List<Tours>> sortedToursCostCheap(){
        List<Tours> tours = tourService.sortToursCostCheap();
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/sortCostExpensive")
    public ResponseEntity<List<Tours>> sortedToursCostExpensive(){
        List<Tours> tours = tourService.sortToursCostExpensive();
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/countTours")
    public ResponseEntity<Long> countTours() {
        long quantityOfTours = tourService.countTours();
        return ResponseEntity.ok(quantityOfTours);
    }
}
