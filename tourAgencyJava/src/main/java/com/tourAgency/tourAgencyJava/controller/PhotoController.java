package com.tourAgency.tourAgencyJava.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.tourAgency.tourAgencyJava.model.Photo;
import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.service.PhotoService;
import com.tourAgency.tourAgencyJava.service.TourService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@RequestMapping("/tourAgency/photo")
public class PhotoController {
    private final PhotoService photoService;

    @GetMapping(value = "/getPhoto/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> getPhotoForTour(@PathVariable long id) {
        List<String> photos = photoService.takePhotoFromTour(id);
        return ResponseEntity.ok(photos);
    }

    @GetMapping(value = "/getFirstPhoto/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Optional<String>> getFirstPhoto(@PathVariable long id){
        Optional<String> photo = photoService.takeFirstPhoto(id);
        return ResponseEntity.ok(photo);
    }
}
