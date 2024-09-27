package com.tourAgency.tourAgencyJava.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.service.TourService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/tourAgency/tours")
public class ToursController {
    private final TourService tourService;

    @PostMapping("/addTour")
    public ResponseEntity<List<Tours>> addTour(@RequestBody Tours tours) {
        List<Tours> toursList = tourService.addTour(tours);
        return ResponseEntity.ok(toursList);
    }


    @GetMapping("/allTours")
    public ResponseEntity<List<Tours>> getAllTours() {
        List<Tours> tours = tourService.allTours();
        return ResponseEntity.ok(tours);
    }

    //    @PreAuthorize("hasRole('ADMIN')")
//    @DeleteMapping("/deleteTour/{id}")
//    public ResponseEntity<String> deleteTour(@PathVariable Long id){
//        tourService.deleteTour(id);
//        return ResponseEntity.ok("Tour deleted");
//    }
    @DeleteMapping("/deleteTour/{id}")
    public ResponseEntity<String> deleteTour(@PathVariable Long id) {
        try {
            tourService.deleteTour(id);
            return ResponseEntity.ok("Tour deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка удаления тура");
        }
    }

}
