package com.tourAgency.tourAgencyJava.controller;


import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.service.TourService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("tourAgency/tours")
public class ToursController {
    private final TourService tourService;

    @PostMapping("/addTour")
    public ResponseEntity<?> addTour(@RequestBody Tours tours){
        tourService.addTour(tours);
        return ResponseEntity.ok("Tour added");
    }
}
