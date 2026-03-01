package com.moviebooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingSummaryDTO {

    private int numberOfSeats;
    private BigDecimal pricePerSeat;
    private BigDecimal baseAmount;
    private BigDecimal convenienceFee;
    private BigDecimal subTotal;
    private BigDecimal gst;
    private BigDecimal totalAmount;
}
