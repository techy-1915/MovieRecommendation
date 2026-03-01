package com.moviebooking.controller;

import com.moviebooking.dto.MovieResponse;
import com.moviebooking.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping
    public ResponseEntity<List<MovieResponse>> getMovies(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String city) {

        if (StringUtils.hasText(genre)) {
            return ResponseEntity.ok(movieService.getMoviesByGenre(genre));
        }
        if (StringUtils.hasText(language)) {
            return ResponseEntity.ok(movieService.getMoviesByLanguage(language));
        }
        if (StringUtils.hasText(city)) {
            return ResponseEntity.ok(movieService.getMoviesByCity(city));
        }
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    @GetMapping("/trending")
    public ResponseEntity<List<MovieResponse>> getTrendingMovies() {
        return ResponseEntity.ok(movieService.getTrendingMovies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieResponse> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }
}
