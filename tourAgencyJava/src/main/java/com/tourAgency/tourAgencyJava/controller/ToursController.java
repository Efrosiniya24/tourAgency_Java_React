package com.tourAgency.tourAgencyJava.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.service.TourService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
            @RequestPart("images") List<MultipartFile> images) {
        Tours tours;
        try {
            tours = objectMapper.readValue(toursJson, Tours.class);
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при десериализации JSON" + e.getMessage());
        }

        Tours savedTour = tourService.addTour(tours, images);
        return ResponseEntity.ok(savedTour);
    }


    @GetMapping("/allTours")
    public ResponseEntity<List<Tours>> getAllTours() {
        List<Tours> tours = tourService.allTours();
        return ResponseEntity.ok(tours);
    }

    @DeleteMapping("/deleteTour/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteTour(@PathVariable Long id) {
        tourService.deleteTour(id);
        return ResponseEntity.ok("Tour deleted");
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping(value = "/updateTour/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Tours> updateTour(
            @RequestPart("tours") String toursJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @PathVariable Long id) {
        Tours tours;
        try {
            tours = objectMapper.readValue(toursJson, Tours.class);
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при десериализации JSON" + e.getMessage());
        }

        Tours updatedTour = tourService.updateTour(tours, id, images);
        return ResponseEntity.ok(updatedTour);
    }


    @GetMapping("/search")
    public ResponseEntity<Optional<List<Tours>>> searchTours(@RequestParam String line){
        Optional<List<Tours>> tours = Optional.ofNullable(tourService.searchTour(line));
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/sortCost")
    public ResponseEntity<List<Tours>> sortedToursCost(){
        List<Tours> tours = tourService.sortToursCost();
        return ResponseEntity.ok(tours);
    }
}
