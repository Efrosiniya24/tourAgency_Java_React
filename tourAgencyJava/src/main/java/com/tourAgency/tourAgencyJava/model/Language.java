package com.tourAgency.tourAgencyJava.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @ManyToMany(mappedBy = "languages")
    private List<Tours> tours;

}
