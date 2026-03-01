package com.moviebooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ShowResponse {

    private Long showId;
    private LocalDateTime showTime;
    private BigDecimal price;
    private String screenName;
    private String theatreName;
    private String city;
}
