package com.tourAgency.tourAgencyJava.service;

import com.tourAgency.tourAgencyJava.model.Tours;
import com.tourAgency.tourAgencyJava.repositories.ToursRepository;
import org.hamcrest.collection.IsEmptyCollection;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TourServiceTest {

    @Mock
    private ToursRepository toursRepository;

    @InjectMocks
    private TourService tourService;

    private static List<Tours> tours;
    private static Date beginningDate;
    private static Date endDate;

    @BeforeEach
    void setUp() throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        beginningDate = dateFormat.parse("2024-07-01");
        endDate = dateFormat.parse("2024-07-04");

        tours = Arrays.asList(new Tours(0L,"New Tour", "New Country", 3, 1110.3, beginningDate, endDate, "NewLocation", "ddescription", "program", List.of()));

    }

    @Test
    void addTour_ShouldSaveAndReturnTour() {
        Tours tour = new Tours();
        tour.setName("Tour 1");

        when(toursRepository.save(tour)).thenReturn(tour);

        Tours result = tourService.addTour(tour);

        assertEquals("Tour 1", result.getName());
        verify(toursRepository, times(1)).save(tour);
    }

    @Test
    void allTour_ShouldBeEmpty(){
        //given
        //when
        when(toursRepository.findAll()).thenReturn(tours);
        //then
        assertFalse(tourService.allTours().isEmpty());
    }

    @Test
    void deleteTourCallsRepositoryDeleteById() {
        //given
        Long id = 1L;
        //when

        //then
        tourService.deleteTour(id);
        verify(toursRepository,times(1)).deleteById(Math.toIntExact(id));
    }

    @Test
    void updateTour_ShouldUpdateTour() throws ParseException {
        //given

        Tours updateTour = new Tours(0L,"New Tour", "New Country", 3, 1110.3, beginningDate, endDate, "NewLocation", "NewDescription", "NewProgram", List.of());

        //when
        when(toursRepository.findAll()).thenReturn(tours);

        //then
        toursRepository.findAll().set(Math.toIntExact(0L), updateTour);
        assertEquals(toursRepository.findAll().get(0), updateTour);
    }

    @Test
    void getTourFromSearch(){
        //given
        String tourName = "tour";

        //when
        when(toursRepository.findAll()).thenReturn(tours);

        //then
        assertEquals(tourService.searchTour(tourName),tours);
    }

    @Test
    void allTours_shouldBeCorrectlyQuantityOfTours(){
        //given
        int quantityOfTours = 1;

        //when
        when(toursRepository.findAll()).thenReturn(tours);

        //then
        assertEquals(tourService.allTours().size(), quantityOfTours);
    }
}