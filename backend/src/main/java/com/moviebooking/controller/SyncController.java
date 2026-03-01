package com.moviebooking.controller;

import com.moviebooking.model.Movie;
import com.moviebooking.repository.MovieRepository;
import com.moviebooking.service.ShowGenerationService;
import com.moviebooking.service.TMDBService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sync")
public class SyncController {

    @Autowired
    private TMDBService tmdbService;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ShowGenerationService showGenerationService;

    @PostMapping("/genres")
    public ResponseEntity<Map<String, String>> syncGenres() {
        tmdbService.syncGenres();
        return ResponseEntity.ok(Map.of("message", "Genre sync initiated"));
    }

    @PostMapping("/movies")
    public ResponseEntity<Map<String, String>> syncMovies() {
        tmdbService.syncMovies();
        return ResponseEntity.ok(Map.of("message", "Movie sync initiated"));
    }

    @PostMapping("/regenerate-shows")
    public ResponseEntity<Map<String, String>> regenerateShows() {
        List<Movie> allMovies = movieRepository.findAll();
        int count = 0;
        for (Movie movie : allMovies) {
            showGenerationService.generateShowsForMovie(movie);
            count++;
        }
        return ResponseEntity.ok(Map.of(
            "message", "Shows regenerated for " + count + " movies",
            "count", String.valueOf(count)
        ));
    }
}
