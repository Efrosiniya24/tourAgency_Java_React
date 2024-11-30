package com.tourAgency.tourAgencyJava.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "photo")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @JsonIgnore
    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    private byte[] imageData;

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "tour_id", referencedColumnName = "id")
    @JsonBackReference
    private Tours tour;
}
