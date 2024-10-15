package com.tourAgency.tourAgencyJava.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Entity
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
    private Date date;

    @Column(name = "status")
    private String status;

    @Column(name = "number_of_people")
    private int numberOfPeople;

    @Column(name = "special_requests")
    private String specialRequests;

    @Column(name = "created_date")
    private Date createdDate;

    @Column(name = "update_status_date")
    private Date updateStatusDate;

    @ManyToOne
    @JoinColumn(name = "tour_id", nullable = false)
    @JsonBackReference(value = "tourReference") // Unique name
    private Tours tour;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference(value = "userReference") // Unique name
    private User user;


//    @ManyToOne
//    @JoinColumn(name = "manager_id")
//    private User manager;
}
