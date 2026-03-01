package com.moviebooking.service;

import com.moviebooking.dto.ShowSummaryResponse;
import com.moviebooking.dto.TheatreWithShowsResponse;
import com.moviebooking.model.Screen;
import com.moviebooking.model.Show;
import com.moviebooking.model.Theatre;
import com.moviebooking.repository.BookingSeatRepository;
import com.moviebooking.repository.ScreenRepository;
import com.moviebooking.repository.SeatRepository;
import com.moviebooking.repository.ShowRepository;
import com.moviebooking.repository.TheatreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TheatreService {

    @Autowired
    private TheatreRepository theatreRepository;

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private ScreenRepository screenRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private BookingSeatRepository bookingSeatRepository;

    public List<TheatreWithShowsResponse> getTheatresForMovie(Long movieId, String city) {
        List<Show> shows;
        if (city != null && !city.isBlank()) {
            shows = showRepository.findByMovie_MovieIdAndScreen_Theatre_City(movieId, city);
        } else {
            shows = showRepository.findByMovie_MovieId(movieId);
        }

        // Group shows by theatre
        Map<Long, TheatreWithShowsResponse> theatreMap = new LinkedHashMap<>();
        for (Show show : shows) {
            Theatre theatre = show.getScreen().getTheatre();
            Long theatreId = theatre.getTheatreId();

            theatreMap.computeIfAbsent(theatreId, id -> new TheatreWithShowsResponse(
                    theatreId,
                    theatre.getTheatreName(),
                    theatre.getCity(),
                    theatre.getAddress(),
                    new ArrayList<>()
            ));

            // Calculate available seats
            int totalSeats = show.getScreen().getTotalSeats() != null ? show.getScreen().getTotalSeats() : 0;
            long bookedSeats = bookingSeatRepository.findByBooking_Show_ShowId(show.getShowId())
                    .stream()
                    .filter(bs -> bs.getStatus() == com.moviebooking.model.BookingSeat.BookingSeatStatus.BOOKED
                            && bs.getBooking().getStatus() == com.moviebooking.model.Booking.BookingStatus.CONFIRMED)
                    .count();
            int availableSeats = (int) (totalSeats - bookedSeats);

            ShowSummaryResponse showSummary = new ShowSummaryResponse(
                    show.getShowId(),
                    show.getShowTime(),
                    show.getScreen().getScreenId(),
                    show.getScreen().getScreenName(),
                    show.getPrice(),
                    Math.max(0, availableSeats)
            );

            theatreMap.get(theatreId).getShows().add(showSummary);
        }

        // Sort shows by time within each theatre
        for (TheatreWithShowsResponse t : theatreMap.values()) {
            t.getShows().sort((a, b) -> a.getShowTime().compareTo(b.getShowTime()));
        }

        return new ArrayList<>(theatreMap.values());
    }
}
