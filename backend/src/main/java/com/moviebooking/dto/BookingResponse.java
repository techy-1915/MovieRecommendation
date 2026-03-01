package com.moviebooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long bookingId;
    private String movieTitle;
    private String moviePoster;
    private String theatreName;
    private String screenName;
    private LocalDateTime showTime;
    private List<String> seats;
    private BigDecimal totalAmount;
    private LocalDateTime bookingDate;
    private String status;
}
