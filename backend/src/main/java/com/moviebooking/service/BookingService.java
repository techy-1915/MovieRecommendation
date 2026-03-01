package com.moviebooking.service;

import com.moviebooking.dto.BookingRequest;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.exception.SeatAlreadyBookedException;
import com.moviebooking.model.*;
import com.moviebooking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingSeatRepository bookingSeatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private SeatRepository seatRepository;

    public Booking createBooking(BookingRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getUserId()));

        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new ResourceNotFoundException("Show not found: " + request.getShowId()));

        // Pessimistic lock on requested seats
        Long screenId = show.getScreen().getScreenId();
        List<Seat> seats = seatRepository.findByScreen_ScreenIdAndSeatIdIn(screenId, request.getSeatIds());

        // Check if any seats are already booked for this show
        List<BookingSeat> existingBookings = bookingSeatRepository
                .findByBooking_Show_ShowIdAndSeat_SeatIdIn(show.getShowId(), request.getSeatIds());

        boolean anyBooked = existingBookings.stream()
                .anyMatch(bs -> bs.getStatus() == BookingSeat.BookingSeatStatus.BOOKED
                        && bs.getBooking().getStatus() == Booking.BookingStatus.CONFIRMED);

        if (anyBooked) {
            throw new SeatAlreadyBookedException("One or more selected seats are already booked");
        }

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShow(show);
        booking.setTotalAmount(request.getTotalAmount());
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        Booking savedBooking = bookingRepository.save(booking);

        // Create booking seats
        for (Seat seat : seats) {
            BookingSeat bookingSeat = new BookingSeat();
            bookingSeat.setBooking(savedBooking);
            bookingSeat.setSeat(seat);
            bookingSeat.setStatus(BookingSeat.BookingSeatStatus.BOOKED);
            bookingSeatRepository.save(bookingSeat);
        }

        return savedBooking;
    }

    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        booking.setStatus(Booking.BookingStatus.CANCELLED);

        // Update only this booking's seats to AVAILABLE
        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBooking_BookingId(bookingId);
        bookingSeats.forEach(bs -> {
            bs.setStatus(BookingSeat.BookingSeatStatus.AVAILABLE);
            bookingSeatRepository.save(bs);
        });

        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUser_UserId(userId);
    }
}
