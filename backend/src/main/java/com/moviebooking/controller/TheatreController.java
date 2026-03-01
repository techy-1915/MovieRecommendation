package com.moviebooking.controller;

import com.moviebooking.dto.TheatreWithShowsResponse;
import com.moviebooking.model.Theatre;
import com.moviebooking.repository.TheatreRepository;
import com.moviebooking.service.TheatreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theatres")
public class TheatreController {

    @Autowired
    private TheatreRepository theatreRepository;

    @Autowired
    private TheatreService theatreService;

    @GetMapping
    public ResponseEntity<?> getTheatres(
            @RequestParam(required = false) Long movieId,
            @RequestParam(required = false) String city) {

        if (movieId != null) {
            return ResponseEntity.ok(theatreService.getTheatresForMovie(movieId, city));
        }
        if (StringUtils.hasText(city)) {
            return ResponseEntity.ok(theatreRepository.findByCity(city));
        }
        return ResponseEntity.ok(theatreRepository.findAll());
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<List<Theatre>> getTheatresByMovie(
            @PathVariable Long movieId,
            @RequestParam(required = false) String city) {

        if (StringUtils.hasText(city)) {
            return ResponseEntity.ok(theatreRepository.findByMovieIdAndCity(movieId, city));
        }
        return ResponseEntity.ok(theatreRepository.findByMovieId(movieId));
    }
}

