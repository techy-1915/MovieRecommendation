package com.moviebooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponse {

    private Long movieId;
    private Integer tmdbId;
    private String title;
    private Integer duration;
    private BigDecimal rating;
    private String language;
    private LocalDate releaseDate;
    private String certificate;
    private String description;
    private String posterUrl;
    private List<String> genres;
    private String region;
}
