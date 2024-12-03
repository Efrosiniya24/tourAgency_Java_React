package com.tourAgency.tourAgencyJava.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "endDate")
    private LocalDate endDate;

    @Column(name = "status")
    private String status;

    @Column(name = "number_of_people")
    private int numberOfPeople;

    @Column(name = "special_requests", nullable = true)
    private String specialRequests;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @Column(name = "update_status_date")
    private LocalDate updateStatusDate;

    @Column(name = "number_of_days")
    private int numberOfDays;

    @Column(name = "name_of_tour")
        private String nameOfTour;

//    @Column (name = "id_tour")
//    private long idTour;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ToString.Exclude
    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinTable(
            name = "order_languages",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "languages_id")
    )
    private List<Language> languages;

    @JsonSetter("languages")
    public void setLanguagesFromJson(List<String> languages) {
        this.languages = languages.stream()
                .map(lang -> Language.builder().language(lang).build())
                .toList();
    }
//    @ManyToOne
//    @JoinColumn(name = "manager_id")
//    private User manager;
}
