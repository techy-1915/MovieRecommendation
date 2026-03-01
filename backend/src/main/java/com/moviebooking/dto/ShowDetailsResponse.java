package com.moviebooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShowDetailsResponse {

    private Long showId;
    private String movieTitle;
    private String moviePoster;
    private String theatreName;
    private String screenName;
    private String city;
    private LocalDateTime showTime;
    private BigDecimal price;
}
