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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class TheatreService {

    private static final Logger logger = LoggerFactory.getLogger(TheatreService.class);

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
        logger.info("Fetching theatres for movie {} in city {}", movieId, city);

        List<Show> shows;
        if (city != null && !city.isBlank()) {
            shows = showRepository.findByMovie_MovieIdAndScreen_Theatre_City(movieId, city);
            logger.info("Found {} shows for movie {} in {}", shows.size(), movieId, city);
        } else {
            shows = showRepository.findByMovie_MovieId(movieId);
            logger.info("Found {} shows for movie {} (all cities)", shows.size(), movieId);
        }

        return buildTheatreResponses(shows, null, null);
    }

    public List<TheatreWithShowsResponse> getTheatresForMovieNearby(Long movieId, Double lat, Double lng) {
        logger.info("Fetching theatres for movie {} near lat={}, lng={}", movieId, lat, lng);
        List<Show> shows = showRepository.findByMovie_MovieId(movieId);
        return buildTheatreResponses(shows, lat, lng);
    }

    private List<TheatreWithShowsResponse> buildTheatreResponses(List<Show> shows, Double userLat, Double userLng) {
        // Group shows by theatre
        Map<Long, TheatreWithShowsResponse> theatreMap = new LinkedHashMap<>();
        for (Show show : shows) {
            Theatre theatre = show.getScreen().getTheatre();
            Long theatreId = theatre.getTheatreId();

            theatreMap.computeIfAbsent(theatreId, id -> {
                Double distance = theatre.getDistanceInKm();
                // If user coordinates provided and theatre has coordinates, compute distance
                if (userLat != null && userLng != null
                        && theatre.getLatitude() != null && theatre.getLongitude() != null) {
                    distance = haversineDistanceKm(userLat, userLng,
                            theatre.getLatitude(), theatre.getLongitude());
                }
                return new TheatreWithShowsResponse(
                        theatreId,
                        theatre.getTheatreName(),
                        theatre.getCity(),
                        theatre.getAddress(),
                        new ArrayList<>(),
                        distance,
                        theatre.getLatitude(),
                        theatre.getLongitude()
                );
            });

            // Calculate available seats
            int totalSeats = show.getScreen().getTotalSeats() != null ? show.getScreen().getTotalSeats() : 0;
            long bookedSeats = bookingSeatRepository.findByBooking_Show_ShowId(show.getShowId())
                    .stream()
                    .filter(bs -> bs.getStatus() == com.moviebooking.model.BookingSeat.BookingSeatStatus.BOOKED
                            && bs.getBooking().getStatus() == com.moviebooking.model.Booking.BookingStatus.CONFIRMED)
                    .count();
            int availableSeats = (int) (totalSeats - bookedSeats);

            Screen screen = show.getScreen();
            ShowSummaryResponse showSummary = new ShowSummaryResponse(
                    show.getShowId(),
                    show.getShowTime(),
                    screen.getScreenId(),
                    screen.getScreenName(),
                    show.getPrice(),
                    Math.max(0, availableSeats),
                    screen.getScreenType(),
                    screen.getScreenSize(),
                    show.getExperienceType(),
                    show.getPriceTier()
            );

            theatreMap.get(theatreId).getShows().add(showSummary);
        }

        // Sort shows by time within each theatre
        for (TheatreWithShowsResponse t : theatreMap.values()) {
            t.getShows().sort(Comparator.comparing(ShowSummaryResponse::getShowTime));
        }

        // Sort theatres by distance ascending; theatres without distance go to the end
        List<TheatreWithShowsResponse> result = new ArrayList<>(theatreMap.values());
        result.sort(Comparator.comparing(TheatreWithShowsResponse::getDistanceInKm,
                Comparator.nullsLast(Double::compareTo)));

        return result;
    }

    /** Haversine formula to calculate great-circle distance in km. */
    private double haversineDistanceKm(double lat1, double lng1, double lat2, double lng2) {
        final double R = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}