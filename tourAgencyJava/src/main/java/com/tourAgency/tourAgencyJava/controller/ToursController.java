package com.tourAgency.tourAgencyJava.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.tourAgency.tourAgencyJava.model.Enum.Role;
import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.service.TourService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.DELETE, RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/tourAgency/tours")
public class ToursController {
    private final TourService tourService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/addTour")
    public ResponseEntity<Tours> addTour(@RequestBody Tours tours) {
        Tours savedTour = tourService.addTour(tours);
        return ResponseEntity.ok(savedTour); // Return the saved tour
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
    @PutMapping("/updateTour/{id}")
    public ResponseEntity<List<Tours>> updateTour(@RequestBody Tours tour, @PathVariable Long id) {
        List<Tours> tours = tourService.updateTour(tour, id);
        return ResponseEntity.ok(tours);
    }

}
