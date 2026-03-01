package com.moviebooking.service;

import com.moviebooking.model.Movie;
import com.moviebooking.model.Screen;
import com.moviebooking.model.Seat;
import com.moviebooking.model.Show;
import com.moviebooking.model.Theatre;
import com.moviebooking.repository.ScreenRepository;
import com.moviebooking.repository.SeatRepository;
import com.moviebooking.repository.ShowRepository;
import com.moviebooking.repository.TheatreRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ShowGenerationService {

    private static final Logger logger = LoggerFactory.getLogger(ShowGenerationService.class);

    private static final Map<String, List<String[]>> CITY_THEATRES = Map.of(
            "Hyderabad", List.of(
                    new String[]{"PVR Inorbit", "Inorbit Mall, HITEC City, Hyderabad 500081"},
                    new String[]{"AMB Cinemas", "Nanakramguda, Financial District, Hyderabad 500032"},
                    new String[]{"Prasads IMAX", "NTR Marg, Lower Tank Bund, Hyderabad 500063"}
            ),
            "Mumbai", List.of(
                    new String[]{"PVR Phoenix", "Phoenix Marketcity, Kurla West, Mumbai 400070"},
                    new String[]{"Inox Megaplex", "R City Mall, LBS Marg, Ghatkopar, Mumbai 400086"},
                    new String[]{"Cinepolis Andheri", "Infiniti Mall, New Link Rd, Andheri West, Mumbai 400053"}
            ),
            "Delhi", List.of(
                    new String[]{"PVR Saket", "Select Citywalk Mall, Saket, New Delhi 110017"},
                    new String[]{"Inox Nehru Place", "DT Mega Mall, Nehru Place, New Delhi 110019"},
                    new String[]{"DLF Promenade", "DLF Promenade Mall, Vasant Kunj, New Delhi 110070"}
            )
    );

    private static final LocalTime[] SHOW_TIMES = {
            LocalTime.of(10, 0),
            LocalTime.of(13, 30),
            LocalTime.of(17, 0),
            LocalTime.of(20, 30)
    };

    private static final BigDecimal NORMAL_PRICE = BigDecimal.valueOf(200);
    private static final BigDecimal PREMIUM_PRICE = BigDecimal.valueOf(300);

    private static final String[] ROWS = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J"};
    private static final int SEATS_PER_ROW = 15;

    @Autowired
    private TheatreRepository theatreRepository;

    @Autowired
    private ScreenRepository screenRepository;

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Transactional
    public void generateShowsForMovie(Movie movie) {
        try {
            for (Map.Entry<String, List<String[]>> cityEntry : CITY_THEATRES.entrySet()) {
                String city = cityEntry.getKey();
                List<String[]> theatreInfoList = cityEntry.getValue();

                for (String[] theatreInfo : theatreInfoList) {
                    String theatreName = theatreInfo[0];
                    String theatreAddress = theatreInfo[1];

                    Theatre theatre = getOrCreateTheatre(theatreName, city, theatreAddress);
                    List<Screen> screens = getOrCreateScreens(theatre);

                    // Create shows for the next 7 days on Screen 1 to keep data manageable
                    Screen screen = screens.get(0);
                    LocalDate today = LocalDate.now();
                    for (int dayOffset = 0; dayOffset < 7; dayOffset++) {
                        LocalDate showDate = today.plusDays(dayOffset);
                        for (LocalTime showTime : SHOW_TIMES) {
                            LocalDateTime showDateTime = LocalDateTime.of(showDate, showTime);
                            // Only create if it doesn't already exist
                            boolean exists = showRepository
                                    .findByMovie_MovieIdAndScreen_Theatre_City(movie.getMovieId(), city)
                                    .stream()
                                    .anyMatch(s -> s.getScreen().getScreenId().equals(screen.getScreenId())
                                            && s.getShowTime().equals(showDateTime));
                            if (!exists) {
                                Show show = new Show();
                                show.setMovie(movie);
                                show.setScreen(screen);
                                show.setShowTime(showDateTime);
                                show.setPrice(NORMAL_PRICE);
                                showRepository.save(show);
                            }
                        }
                    }
                }
            }
            logger.info("Generated shows for movie: {}", movie.getTitle());
        } catch (Exception e) {
            logger.error("Failed to generate shows for movie {}: {}", movie.getTitle(), e.getMessage());
        }
    }

    private Theatre getOrCreateTheatre(String name, String city, String address) {
        return theatreRepository.findByCity(city).stream()
                .filter(t -> t.getTheatreName().equals(name))
                .findFirst()
                .orElseGet(() -> {
                    Theatre t = new Theatre();
                    t.setTheatreName(name);
                    t.setCity(city);
                    t.setAddress(address);
                    return theatreRepository.save(t);
                });
    }

    private List<Screen> getOrCreateScreens(Theatre theatre) {
        List<Screen> existing = screenRepository.findByTheatre_TheatreId(theatre.getTheatreId());
        if (!existing.isEmpty()) {
            return existing;
        }
        List<Screen> screens = new ArrayList<>();
        for (int i = 1; i <= 2; i++) {
            Screen screen = new Screen();
            screen.setTheatre(theatre);
            screen.setScreenName("Screen " + i);
            screen.setTotalSeats(ROWS.length * SEATS_PER_ROW);
            screen = screenRepository.save(screen);
            createSeatsForScreen(screen);
            screens.add(screen);
        }
        return screens;
    }

    private void createSeatsForScreen(Screen screen) {
        for (int rowIdx = 0; rowIdx < ROWS.length; rowIdx++) {
            String row = ROWS[rowIdx];
            Seat.SeatType seatType = rowIdx < 6 ? Seat.SeatType.NORMAL : Seat.SeatType.PREMIUM;
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
}
