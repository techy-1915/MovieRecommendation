package com.moviebooking.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
public class BookingRequest {

    private Long userId;
    private Long showId;
    private List<Long> seatIds;
    private BigDecimal totalAmount;
}
