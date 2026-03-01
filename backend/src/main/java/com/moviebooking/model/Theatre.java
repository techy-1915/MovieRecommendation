package com.moviebooking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "theatres")
public class Theatre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "theatre_id")
    private Long theatreId;

    @Column(name = "theatre_name", nullable = false, length = 200)
    private String theatreName;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "address", length = 500)
    private String address;
}
