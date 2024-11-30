package com.tourAgency.tourAgencyJava.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "languages")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Language {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @Column(name = "language")
    private String language;

    @JsonIgnore
    @ToString.Exclude
    @ManyToMany(mappedBy = "languages")
    private List<Tours> tours;

    @JsonIgnore
    @ManyToMany(mappedBy = "languages")
    private List<Order> order;

}
