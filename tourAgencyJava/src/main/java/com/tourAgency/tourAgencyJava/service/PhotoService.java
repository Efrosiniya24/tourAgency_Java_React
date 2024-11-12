package com.tourAgency.tourAgencyJava.service;

import com.tourAgency.tourAgencyJava.model.Photo;
import com.tourAgency.tourAgencyJava.repositories.PhotoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import java.util.Base64;

@Service
@AllArgsConstructor
public class PhotoService {

    private final PhotoRepository photoRepository;

    public List<String> takePhotoFromTour(Long id) {
        return photoRepository.findAll()
                .stream()
                .filter(photo -> photo.getTour().getId().equals(id))
                .map(photo -> Base64.getEncoder().encodeToString(photo.getImageData()))
                .collect(Collectors.toList());
    }
}
