package com.moviebooking.service;

import com.moviebooking.dto.BookingConfirmationDTO;
import com.moviebooking.dto.BookingRequest;
import com.moviebooking.dto.BookingResponse;
import com.moviebooking.dto.BookingSummaryDTO;
import com.moviebooking.dto.PaymentRequest;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.exception.SeatAlreadyBookedException;
import com.moviebooking.model.*;
import com.moviebooking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    public BookingResponse createBooking(BookingRequest request) {
        Booking booking = createBookingEntity(
                request.getUserId(), request.getShowId(),
                request.getSeatIds(), request.getTotalAmount());
        return toBookingResponse(booking);
    }

    public BookingConfirmationDTO processPayment(PaymentRequest request) {
        Booking booking = createBookingEntity(
                request.getUserId(), request.getShowId(),
                request.getSeatIds(), request.getTotalAmount());
        return new BookingConfirmationDTO(booking.getBookingId(), request.getPaymentMethod(), booking.getStatus().name());
    }

    public BookingSummaryDTO calculateTotal(BookingRequest request) {
        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new ResourceNotFoundException("Show not found: " + request.getShowId()));

        int numberOfSeats = request.getSeatIds().size();
        BigDecimal pricePerSeat = show.getPrice();
        BigDecimal baseAmount = pricePerSeat.multiply(BigDecimal.valueOf(numberOfSeats));
        BigDecimal convenienceFeePerTicket = new BigDecimal("23.60");
        BigDecimal convenienceFee = convenienceFeePerTicket.multiply(BigDecimal.valueOf(numberOfSeats));
        BigDecimal subTotal = baseAmount.add(convenienceFee);
        BigDecimal gst = subTotal.multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subTotal.add(gst).setScale(2, RoundingMode.HALF_UP);

        return new BookingSummaryDTO(numberOfSeats, pricePerSeat, baseAmount, convenienceFee, subTotal, gst, totalAmount);
    }

    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));
        return toBookingResponse(booking);
    }

    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        booking.setStatus(Booking.BookingStatus.CANCELLED);

        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBooking_BookingId(bookingId);
        bookingSeats.forEach(bs -> {
            bs.setStatus(BookingSeat.BookingSeatStatus.AVAILABLE);
            bookingSeatRepository.save(bs);
        });

        Booking saved = bookingRepository.save(booking);
        return toBookingResponse(saved);
    }

    public List<BookingResponse> getUserBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findByUser_UserId(userId);
        return bookings.stream().map(this::toBookingResponse).collect(Collectors.toList());
    }

    private Booking createBookingEntity(Long userId, Long showId, List<Long> seatIds, BigDecimal totalAmount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found: " + showId));

        Long screenId = show.getScreen().getScreenId();
        List<Seat> seats = seatRepository.findByScreen_ScreenIdAndSeatIdIn(screenId, seatIds);

        List<BookingSeat> existingBookings = bookingSeatRepository
                .findByBooking_Show_ShowIdAndSeat_SeatIdIn(show.getShowId(), seatIds);

        boolean anyBooked = existingBookings.stream()
                .anyMatch(bs -> bs.getStatus() == BookingSeat.BookingSeatStatus.BOOKED
                        && bs.getBooking().getStatus() == Booking.BookingStatus.CONFIRMED);

        if (anyBooked) {
            throw new SeatAlreadyBookedException("One or more selected seats are already booked");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShow(show);
        booking.setTotalAmount(totalAmount);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        Booking savedBooking = bookingRepository.save(booking);

        for (Seat seat : seats) {
            BookingSeat bookingSeat = new BookingSeat();
            bookingSeat.setBooking(savedBooking);
            bookingSeat.setSeat(seat);
            bookingSeat.setStatus(BookingSeat.BookingSeatStatus.BOOKED);
            bookingSeatRepository.save(bookingSeat);
        }

        return savedBooking;
    }

    private BookingResponse toBookingResponse(Booking booking) {
        Show show = booking.getShow();
        String movieTitle = show.getMovie().getTitle();
        String moviePoster = show.getMovie().getPosterUrl();
        String theatreName = show.getScreen().getTheatre().getTheatreName();
        String screenName = show.getScreen().getScreenName();

        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBooking_BookingId(booking.getBookingId());
        List<String> seatLabels = bookingSeats.stream()
                .map(bs -> bs.getSeat().getRowNo() + bs.getSeat().getSeatNumber())
                .collect(Collectors.toList());

        return new BookingResponse(
                booking.getBookingId(),
                movieTitle,
                moviePoster,
                theatreName,
                screenName,
                show.getShowTime(),
                seatLabels,
                booking.getTotalAmount(),
                booking.getBookingTime(),
                booking.getStatus().name()
        );
    }
}
