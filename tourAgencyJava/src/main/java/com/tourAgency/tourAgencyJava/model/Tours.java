package com.tourAgency.tourAgencyJava.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @Column(name = "description")
    private String description;

    @Column(name = "program")
    private String program;

    @JsonIgnore
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "tourReference") // Match with back-reference
    private List<Order> orders;




}
