package com.moviebooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowSummaryResponse {

    private Long showId;
    private LocalDateTime showTime;
    private Long screenId;
    private String screenName;
    private BigDecimal price;
    private int availableSeatsCount;
}
