package com.moviebooking.service;

import com.moviebooking.model.Genre;
import com.moviebooking.model.Movie;
import com.moviebooking.repository.GenreRepository;
import com.moviebooking.repository.MovieRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class TMDBService {

    private static final Logger logger = LoggerFactory.getLogger(TMDBService.class);

    @Value("${tmdb.api.key}")
    private String apiKey;

    @Value("${tmdb.base.url}")
    private String baseUrl;

    @Value("${tmdb.image.base.url}")
    private String imageBaseUrl;

    @Autowired
    private GenreRepository genreRepository;

    @Autowired
    private MovieRepository movieRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        if (movieRepository.count() == 0) {
            logger.info("No movies found in database. Auto-syncing from TMDB...");
            syncGenres();
            syncMovies();
        }
    }

    @SuppressWarnings("unchecked")
    public void syncGenres() {
        if ("YOUR_TMDB_API_KEY".equals(apiKey) || apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured. Skipping genre sync.");
            return;
        }

        try {
            String url = baseUrl + "/genre/movie/list?api_key=" + apiKey + "&language=en-US";
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && response.containsKey("genres")) {
                List<Map<String, Object>> genres = (List<Map<String, Object>>) response.get("genres");
                for (Map<String, Object> genreData : genres) {
                    String name = (String) genreData.get("name");
                    genreRepository.findByGenreName(name).orElseGet(() -> {
                        Genre genre = new Genre();
                        genre.setGenreName(name);
                        return genreRepository.save(genre);
                    });
                }
                logger.info("Synced {} genres from TMDB", genres.size());
            }
        } catch (Exception e) {
            logger.error("Failed to sync genres from TMDB: {}", e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public void syncMovies() {
        if ("YOUR_TMDB_API_KEY".equals(apiKey) || apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured. Skipping movie sync.");
            return;
        }

        try {
            syncMoviesFromEndpoint("/movie/now_playing");
            syncMoviesFromEndpoint("/movie/popular");
        } catch (Exception e) {
            logger.error("Failed to sync movies from TMDB: {}", e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private void syncMoviesFromEndpoint(String endpoint) {
        for (int page = 1; page <= 3; page++) {
            String url = baseUrl + endpoint + "?api_key=" + apiKey + "&language=en-US&page=" + page;
            try {
                Map<String, Object> response = restTemplate.getForObject(url, Map.class);
                if (response == null || !response.containsKey("results")) break;

                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
                for (Map<String, Object> movieData : results) {
                    saveOrUpdateMovie(movieData);
                }
                logger.info("Synced page {} from {}", page, endpoint);
            } catch (Exception e) {
                logger.error("Error syncing page {} from {}: {}", page, endpoint, e.getMessage());
            }
        }
    }

    @SuppressWarnings("unchecked")
    private void saveOrUpdateMovie(Map<String, Object> data) {
        Integer tmdbId = (Integer) data.get("id");
        if (tmdbId == null) return;

        Movie movie = movieRepository.findByTmdbId(tmdbId).orElse(new Movie());
        movie.setTmdbId(tmdbId);
        movie.setTitle((String) data.getOrDefault("title", "Unknown"));
        movie.setDescription((String) data.getOrDefault("overview", ""));

        String posterPath = (String) data.get("poster_path");
        if (posterPath != null) {
            movie.setPosterUrl(imageBaseUrl + posterPath);
        }

        Object voteAvg = data.get("vote_average");
        if (voteAvg instanceof Number) {
            movie.setRating(BigDecimal.valueOf(((Number) voteAvg).doubleValue()));
        }

        String releaseDateStr = (String) data.get("release_date");
        if (releaseDateStr != null && !releaseDateStr.isBlank()) {
            try {
                movie.setReleaseDate(LocalDate.parse(releaseDateStr));
            } catch (Exception e) {
                logger.debug("Could not parse release date: {}", releaseDateStr);
            }
        }

        movie.setLanguage((String) data.getOrDefault("original_language", "en"));

        // Resolve genres
        List<Integer> genreIds = (List<Integer>) data.get("genre_ids");
        if (genreIds != null) {
            List<Genre> genres = new ArrayList<>();
            for (Integer gId : genreIds) {
                // Try to find by known TMDB genre mapping (best-effort; genres must be synced first)
                genreRepository.findAll().stream()
                        .filter(g -> matchesTmdbGenreId(gId, g.getGenreName()))
                        .findFirst()
                        .ifPresent(genres::add);
            }
            movie.setGenres(genres);
        }

        movieRepository.save(movie);
    }

    // Minimal TMDB genre id ↔ name mapping for resolution without extra API call
    private boolean matchesTmdbGenreId(Integer tmdbGenreId, String genreName) {
        Map<Integer, String> mapping = Map.ofEntries(
            Map.entry(28, "Action"), Map.entry(12, "Adventure"), Map.entry(16, "Animation"),
            Map.entry(35, "Comedy"), Map.entry(80, "Crime"), Map.entry(99, "Documentary"),
            Map.entry(18, "Drama"), Map.entry(10751, "Family"), Map.entry(14, "Fantasy"),
            Map.entry(36, "History"), Map.entry(27, "Horror"), Map.entry(10402, "Music"),
            Map.entry(9648, "Mystery"), Map.entry(10749, "Romance"), Map.entry(878, "Science Fiction"),
            Map.entry(10770, "TV Movie"), Map.entry(53, "Thriller"), Map.entry(10752, "War"),
            Map.entry(37, "Western")
        );
        return genreName.equals(mapping.get(tmdbGenreId));
    }
}
