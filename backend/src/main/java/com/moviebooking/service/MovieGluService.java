package com.moviebooking.service;

import com.moviebooking.model.Movie;
import com.moviebooking.model.Screen;
import com.moviebooking.model.Seat;
import com.moviebooking.model.Show;
import com.moviebooking.model.Theatre;
import com.moviebooking.repository.MovieRepository;
import com.moviebooking.repository.ScreenRepository;
import com.moviebooking.repository.SeatRepository;
import com.moviebooking.repository.ShowRepository;
import com.moviebooking.repository.TheatreRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MovieGluService {

    private static final Logger logger = LoggerFactory.getLogger(MovieGluService.class);

    private static final String[] SEAT_ROWS = {"A", "B", "C", "D", "E", "F", "G", "H"};
    private static final int SEATS_PER_ROW = 12;
    private static final BigDecimal DEFAULT_PRICE = BigDecimal.valueOf(250);

    @Value("${movieglu.api.client:}")
    private String client;

    @Value("${movieglu.api.key:}")
    private String apiKey;

    @Value("${movieglu.api.secret:}")
    private String apiSecret;

    @Value("${movieglu.api.territory:IN}")
    private String territory;

    @Value("${movieglu.api.base.url:https://sandbox.movieglu.com}")
    private String baseUrl;

    @Autowired
    private TheatreRepository theatreRepository;

    @Autowired
    private ScreenRepository screenRepository;

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private MovieRepository movieRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank()
                && client != null && !client.isBlank()
                && apiSecret != null && !apiSecret.isBlank();
    }

    /**
     * Full sync: fetch cinemas near the given coordinates, then for each cinema
     * fetch showtime data for the next {@code daysAhead} days and map them to our
     * Movie / Theatre / Screen / Show model.
     */
    @Transactional
    public int syncCinemasAndShows(double lat, double lng, int maxCinemas, int daysAhead) {
        if (!isConfigured()) {
            logger.warn("MovieGlu API credentials not configured. Skipping sync. "
                    + "Set movieglu.api.client, movieglu.api.key, and movieglu.api.secret in application.properties.");
            return 0;
        }

        logger.info("Starting MovieGlu sync: lat={}, lng={}, maxCinemas={}, daysAhead={}", lat, lng, maxCinemas, daysAhead);

        List<Map<String, Object>> cinemas = fetchCinemasNearby(lat, lng, maxCinemas);
        int showCount = 0;
        for (Map<String, Object> cinemaData : cinemas) {
            Theatre theatre = upsertTheatre(cinemaData, lat, lng);
            for (int dayOffset = 0; dayOffset < daysAhead; dayOffset++) {
                LocalDate date = LocalDate.now().plusDays(dayOffset);
                List<Map<String, Object>> showsData = fetchCinemaShowTimes(
                        String.valueOf(cinemaData.get("cinema_id")), date);
                showCount += persistShows(theatre, showsData, date);
            }
        }

        logger.info("MovieGlu sync complete: {} shows persisted", showCount);
        return showCount;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // API calls
    // ─────────────────────────────────────────────────────────────────────────

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchCinemasNearby(double lat, double lng, int n) {
        try {
            String url = baseUrl + "/cinemasNearby?n=" + n;
            HttpHeaders headers = buildHeaders(lat, lng);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET,
                    new HttpEntity<>(headers), Map.class);

            if (response.getBody() != null && response.getBody().containsKey("cinemas")) {
                List<Map<String, Object>> cinemas =
                        (List<Map<String, Object>>) response.getBody().get("cinemas");
                logger.info("MovieGlu returned {} nearby cinemas", cinemas.size());
                return cinemas;
            }
        } catch (Exception e) {
            logger.error("Failed to fetch cinemas from MovieGlu: {}", e.getMessage());
        }
        return new ArrayList<>();
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchCinemaShowTimes(String cinemaId, LocalDate date) {
        try {
            String dateStr = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
            String url = baseUrl + "/cinemaShowTimes?cinema_id=" + cinemaId + "&date=" + dateStr;
            HttpHeaders headers = buildHeaders(null, null);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET,
                    new HttpEntity<>(headers), Map.class);

            if (response.getBody() != null && response.getBody().containsKey("films")) {
                List<Map<String, Object>> films =
                        (List<Map<String, Object>>) response.getBody().get("films");
                logger.debug("MovieGlu returned {} films for cinema {} on {}", films.size(), cinemaId, dateStr);
                return films;
            }
        } catch (Exception e) {
            logger.error("Failed to fetch show times for cinema {}: {}", cinemaId, e.getMessage());
        }
        return new ArrayList<>();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Persist helpers
    // ─────────────────────────────────────────────────────────────────────────

    private Theatre upsertTheatre(Map<String, Object> cinemaData, double userLat, double userLng) {
        String movieGluId = String.valueOf(cinemaData.get("cinema_id"));
        String name = (String) cinemaData.getOrDefault("cinema_name", "Unknown Cinema");

        // address
        Map<String, Object> addressMap = (Map<String, Object>) cinemaData.get("address");
        String address = addressMap != null ? buildAddressString(addressMap) : "";

        // coordinates
        Map<String, Object> geoMap = (Map<String, Object>) cinemaData.get("geolocation");
        Double lat = null;
        Double lng = null;
        if (geoMap != null) {
            lat = toDouble(geoMap.get("lat"));
            lng = toDouble(geoMap.get("long"));
        }

        // distance (reported by API or computed)
        Double distance = toDouble(cinemaData.get("distance"));

        Optional<Theatre> existing = theatreRepository.findByMovieGluId(movieGluId);
        Theatre theatre = existing.orElse(new Theatre());
        theatre.setMovieGluId(movieGluId);
        theatre.setTheatreName(name);
        theatre.setAddress(address);
        if (lat != null) theatre.setLatitude(lat);
        if (lng != null) theatre.setLongitude(lng);
        if (distance != null) theatre.setDistanceInKm(distance);

        // Derive city from address when possible
        if (addressMap != null && addressMap.containsKey("city")) {
            theatre.setCity((String) addressMap.get("city"));
        } else if (theatre.getCity() == null || theatre.getCity().isBlank()) {
            theatre.setCity("Unknown");
        }

        return theatreRepository.save(theatre);
    }

    @SuppressWarnings("unchecked")
    private int persistShows(Theatre theatre, List<Map<String, Object>> films, LocalDate date) {
        int count = 0;
        for (Map<String, Object> film : films) {
            String filmTitle = (String) film.getOrDefault("film_name", "");
            if (filmTitle.isBlank()) continue;

            // Match to our Movie by title
            Optional<Movie> movieOpt = movieRepository.findByTitleIgnoreCase(filmTitle);
            if (movieOpt.isEmpty()) {
                logger.debug("No movie found in DB for title '{}', skipping", filmTitle);
                continue;
            }
            Movie movie = movieOpt.get();

            List<Map<String, Object>> showtimes =
                    (List<Map<String, Object>>) film.getOrDefault("showings", new ArrayList<>());

            for (Map<String, Object> showing : showtimes) {
                String screenName = (String) showing.getOrDefault("display_name", "Screen 1");
                String screenFormat = (String) showing.getOrDefault("film_type", "2D");
                String experienceType = (String) showing.getOrDefault("showing_attributes", "");

                // Screen size heuristic from screen name / format
                String screenSize = deriveScreenSize(screenName, screenFormat);

                Screen screen = upsertScreen(theatre, screenName, screenFormat, screenSize);

                List<Map<String, Object>> times =
                        (List<Map<String, Object>>) showing.getOrDefault("times", new ArrayList<>());

                for (Map<String, Object> time : times) {
                    String startTime = (String) time.getOrDefault("start_time", "");
                    if (startTime.isBlank()) continue;

                    LocalDateTime showDateTime = parseShowTime(date, startTime);
                    if (showDateTime == null) continue;

                    boolean exists = showRepository
                            .existsByMovie_MovieIdAndScreen_ScreenIdAndShowTime(
                                    movie.getMovieId(), screen.getScreenId(), showDateTime);
                    if (!exists) {
                        Show show = new Show();
                        show.setMovie(movie);
                        show.setScreen(screen);
                        show.setShowTime(showDateTime);
                        show.setPrice(DEFAULT_PRICE);
                        show.setExperienceType(experienceType);
                        show.setPriceTier(derivePriceTier(screenFormat));
                        showRepository.save(show);
                        count++;
                    }
                }
            }
        }
        return count;
    }

    private Screen upsertScreen(Theatre theatre, String screenName, String screenType, String screenSize) {
        List<Screen> existing = screenRepository.findByTheatre_TheatreId(theatre.getTheatreId());
        for (Screen s : existing) {
            if (screenName.equals(s.getScreenName())) {
                return s;
            }
        }
        Screen screen = new Screen();
        screen.setTheatre(theatre);
        screen.setScreenName(screenName);
        screen.setScreenType(screenType);
        screen.setScreenSize(screenSize);
        screen.setTotalSeats(SEAT_ROWS.length * SEATS_PER_ROW);
        screen = screenRepository.save(screen);
        createSeatsForScreen(screen);
        return screen;
    }

    private void createSeatsForScreen(Screen screen) {
        for (int rowIdx = 0; rowIdx < SEAT_ROWS.length; rowIdx++) {
            String row = SEAT_ROWS[rowIdx];
            Seat.SeatType seatType = rowIdx < 4 ? Seat.SeatType.NORMAL : Seat.SeatType.PREMIUM;
            for (int seatNum = 1; seatNum <= SEATS_PER_ROW; seatNum++) {
                Seat seat = new Seat();
                seat.setScreen(screen);
                seat.setRowNo(row);
                seat.setSeatNumber(seatNum);
                seat.setSeatType(seatType);
                seatRepository.save(seat);
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Header builder
    // ─────────────────────────────────────────────────────────────────────────

    private HttpHeaders buildHeaders(Double lat, Double lng) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("client", client);
        headers.set("x-api-key", apiKey);
        headers.set("territory", territory);
        headers.set("api-version", "v200");
        headers.set("device-datetime",
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        String credentials = client + ":" + apiSecret;
        headers.set("Authorization", "Basic " +
                Base64.getEncoder().encodeToString(credentials.getBytes()));

        if (lat != null && lng != null) {
            headers.set("geolocation", lat + ";" + lng);
        }
        return headers;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Utility helpers
    // ─────────────────────────────────────────────────────────────────────────

    private LocalDateTime parseShowTime(LocalDate date, String startTime) {
        try {
            // startTime may be "HH:mm" or "HH:mm:ss"
            String[] parts = startTime.split(":");
            int hour = Integer.parseInt(parts[0]);
            int minute = parts.length > 1 ? Integer.parseInt(parts[1]) : 0;
            return LocalDateTime.of(date.getYear(), date.getMonth(), date.getDayOfMonth(), hour, minute);
        } catch (Exception e) {
            logger.debug("Could not parse show time '{}': {}", startTime, e.getMessage());
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    private String buildAddressString(Map<String, Object> addressMap) {
        List<String> parts = new ArrayList<>();
        if (addressMap.get("address1") instanceof String s && !s.isBlank()) parts.add(s);
        if (addressMap.get("address2") instanceof String s && !s.isBlank()) parts.add(s);
        if (addressMap.get("city") instanceof String s && !s.isBlank()) parts.add(s);
        if (addressMap.get("postcode") instanceof String s && !s.isBlank()) parts.add(s);
        return String.join(", ", parts);
    }

    private Double toDouble(Object val) {
        if (val instanceof Number n) return n.doubleValue();
        if (val instanceof String s) {
            try { return Double.parseDouble(s); } catch (NumberFormatException ignored) {}
        }
        return null;
    }

    private String deriveScreenSize(String screenName, String format) {
        String upper = (screenName + " " + format).toUpperCase();
        if (upper.contains("IMAX")) return "IMAX";
        if (upper.contains("4DX") || upper.contains("DOLBY")) return "large";
        if (upper.contains("SCREEN 1") || upper.contains("SCREEN1")) return "large";
        if (upper.contains("SCREEN 2") || upper.contains("SCREEN2")) return "medium";
        return "medium";
    }

    private String derivePriceTier(String format) {
        if (format == null) return "Standard";
        String upper = format.toUpperCase();
        if (upper.contains("IMAX") || upper.contains("4DX") || upper.contains("DOLBY")) return "Premium";
        if (upper.contains("3D")) return "Gold";
        return "Standard";
    }
}
