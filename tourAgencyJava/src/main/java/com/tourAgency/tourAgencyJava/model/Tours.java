package com.tourAgency.tourAgencyJava.model;


import com.fasterxml.jackson.annotation.*;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Data
@Table(name = "tours")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "country")
    private String country;

    @Column(name = "number_of_days")
    private int numberOfDays;

    @Column(name = "price")
    private double price;

    @Column(name = "beginning_date")
    private Date beginningDate;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "location")
    private String location;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "program")
    private String program;

    @JsonIgnore
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders;

//    @Nullable
    @JsonIgnore
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Photo> photos;

    @JsonIdentityInfo(
            generator = ObjectIdGenerators.PropertyGenerator.class,
            property = "id"
    )
    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinTable(
            name = "tour_languages",
            joinColumns = @JoinColumn(name = "tour_id"),
            inverseJoinColumns = @JoinColumn(name = "languages_id")
    )
    private List<Language> languages;

    @JsonSetter("languages")
    public void setLanguagesFromJson(List<String> languages) {
        this.languages = languages.stream()
                .map(lang -> Language.builder().language(lang).build())
                .toList();
    }
}