package com.moviebooking.service;

import com.moviebooking.dto.SeatResponse;
import com.moviebooking.model.BookingSeat;
import com.moviebooking.model.Seat;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.model.Show;
import com.moviebooking.repository.BookingSeatRepository;
import com.moviebooking.repository.SeatRepository;
import com.moviebooking.repository.ShowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SeatService {

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private BookingSeatRepository bookingSeatRepository;

    public List<SeatResponse> getSeatsForShow(Long showId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found: " + showId));

        Long screenId = show.getScreen().getScreenId();
        List<Seat> allSeats = seatRepository.findByScreen_ScreenId(screenId);

        // Find booked seat IDs for this show
        List<BookingSeat> bookedEntries = bookingSeatRepository.findByBooking_Show_ShowId(showId);
        Set<Long> bookedSeatIds = bookedEntries.stream()
                .filter(bs -> bs.getStatus() == BookingSeat.BookingSeatStatus.BOOKED
                        && bs.getBooking().getStatus() == com.moviebooking.model.Booking.BookingStatus.CONFIRMED)
                .map(bs -> bs.getSeat().getSeatId())
                .collect(Collectors.toSet());

        return allSeats.stream()
                .map(seat -> new SeatResponse(
                        seat.getSeatId(),
                        seat.getRowNo(),
                        seat.getSeatNumber(),
                        seat.getSeatType().name(),
                        bookedSeatIds.contains(seat.getSeatId())
                ))
                .collect(Collectors.toList());
    }
}
