package com.moviebooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SeatResponse {

    private Long seatId;
    private String rowNo;
    private Integer seatNumber;
    private String seatType;
    private boolean isBooked;
}
