package com.tourAgency.tourAgencyJava.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.service.TourService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("tourAgency/tours")
public class ToursController {
    private final TourService tourService;
    private final ObjectMapper objectMapper;

    @PostMapping("/addTour")
    public ResponseEntity<?> addTour(@RequestBody Tours tours) {
        tourService.addTour(tours);
        return ResponseEntity.ok("Tour added");
    }

    @GetMapping("/allTours")
    public String getAllTours() throws JsonProcessingException {
        List<Tours> tours =tourService.allTours();
        return objectMapper.writeValueAsString(tours);
    }
}
